import { C } from '../theme';

const links = [
  ['context', 'Context'],
  ['rails', 'Two Rails'],
  ['tiers', 'Tiers'],
  ['entities', 'Entities'],
  ['flow', 'Flow'],
  ['offline', 'Offline'],
  ['disputes', 'Disputes'],
  ['trust', 'Score'],
  ['fraud', 'Fraud'],
  ['ports', 'Ports'],
  ['phases', 'Phases'],
  ['sources', 'Sources'],
];

export default function Nav() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav className="nav">
      <span className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Thiqa
      </span>
      {links.map(([id, label]) => (
        <a key={id} onClick={() => scroll(id)} style={{ cursor: 'pointer' }}>{label}</a>
      ))}
    </nav>
  );
}
