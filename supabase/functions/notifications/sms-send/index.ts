/**
 * Edge Function: Send SMS via Africa's Talking
 *
 * Called by a Supabase cron job or database webhook when new
 * notifications appear in the queue with status = 'pending'.
 *
 * Environment variables:
 *   AT_API_KEY     — Africa's Talking API key
 *   AT_USERNAME    — Africa's Talking username
 *   AT_SENDER_ID   — Sender ID (e.g., "CATSP")
 *   SUPABASE_URL   — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — for server-side DB access
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const AT_API_URL = 'https://api.africastalking.com/version1/messaging'

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  // Get pending notifications
  const { data: pending, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('status', 'pending')
    .eq('channel', 'sms')
    .limit(50)

  if (error || !pending?.length) {
    return new Response(JSON.stringify({ sent: 0, error: error?.message }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = Deno.env.get('AT_API_KEY')
  const username = Deno.env.get('AT_USERNAME')
  const senderId = Deno.env.get('AT_SENDER_ID') ?? 'CATSP'

  let sent = 0
  let failed = 0

  for (const notif of pending) {
    if (!notif.phone_number || !notif.message_text) {
      await supabase.from('notifications').update({
        status: 'failed',
        failure_reason: 'Missing phone number or message text',
      }).eq('id', notif.id)
      failed++
      continue
    }

    // Mark as sending
    await supabase.from('notifications').update({ status: 'sending' }).eq('id', notif.id)

    try {
      if (!apiKey || !username) {
        // Dev mode — log instead of sending
        console.log(`[SMS DEV] To: ${notif.phone_number} | ${notif.message_text}`)
        await supabase.from('notifications').update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_ref: 'dev-mode',
        }).eq('id', notif.id)
        sent++
        continue
      }

      // Send via Africa's Talking
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('to', notif.phone_number)
      formData.append('message', notif.message_text)
      formData.append('from', senderId)

      const response = await fetch(AT_API_URL, {
        method: 'POST',
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString(),
      })

      const result = await response.json()
      const recipient = result?.SMSMessageData?.Recipients?.[0]

      if (recipient?.status === 'Success') {
        await supabase.from('notifications').update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_ref: recipient.messageId,
        }).eq('id', notif.id)
        sent++
      } else {
        await supabase.from('notifications').update({
          status: 'failed',
          failure_reason: recipient?.status ?? 'Unknown error',
        }).eq('id', notif.id)
        failed++
      }
    } catch (e: any) {
      await supabase.from('notifications').update({
        status: 'failed',
        failure_reason: e.message ?? 'Network error',
      }).eq('id', notif.id)
      failed++
    }
  }

  return new Response(JSON.stringify({ sent, failed, total: pending.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
