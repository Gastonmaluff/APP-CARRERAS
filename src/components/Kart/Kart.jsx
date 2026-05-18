import './Kart.css';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Kart({ seller, isOverGoal }) {
  const initials = getInitials(seller.nombre);

  return (
    <div
      className={`kart${isOverGoal ? ' kart--winner' : ''}`}
      style={{ '--kart-color': seller.colorAuto }}
      aria-label={`${seller.nombre}: ${seller.cajasVendidas} cajas vendidas`}
    >
      <div className="kart__speed" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="kart__avatar">
        {seller.fotoUrl ? <img src={seller.fotoUrl} alt="" /> : <span>{initials}</span>}
      </div>
      <svg className="kart__car" viewBox="0 0 132 68" role="img" aria-hidden="true">
        <path
          className="kart__shadow"
          d="M20 58c10 7 74 9 93 0 7-3 4-10-5-10H25c-11 0-15 6-5 10Z"
        />
        <path
          className="kart__body"
          d="M21 42c2-14 13-23 31-25l16-11c5-4 12-5 18-2l16 8c11 2 20 9 24 19l3 11c2 7-2 13-9 13H30c-7 0-11-6-9-13Z"
        />
        <path
          className="kart__nose"
          d="M82 19h18c9 1 16 7 20 16H88c-6 0-10-5-8-11l2-5Z"
        />
        <path className="kart__window" d="M54 19 68 9c4-3 9-3 14-1l12 6-8 16H54V19Z" />
        <path className="kart__shine" d="M34 35c10-8 26-13 45-13" />
        <circle className="kart__wheel" cx="42" cy="53" r="12" />
        <circle className="kart__wheel" cx="104" cy="53" r="12" />
        <circle className="kart__hub" cx="42" cy="53" r="5" />
        <circle className="kart__hub" cx="104" cy="53" r="5" />
      </svg>
    </div>
  );
}
