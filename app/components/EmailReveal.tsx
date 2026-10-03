export default function EmailReveal() {
  const addr = ['mugacharooneysam', 'gmail.com'].join('@');
  return <a href={`mailto:${addr}`}>{addr}</a>;
}
