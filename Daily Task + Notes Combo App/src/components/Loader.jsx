export default function Loader({size=28}) {
  return (
    <div style={{display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
      <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden>
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth="6" />
        <path d="M45 25a20 20 0 0 0-20-20" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" fill="none" transform="rotate(0 25 25)">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  );
}
