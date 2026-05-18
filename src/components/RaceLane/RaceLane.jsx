import Kart from '../Kart/Kart.jsx';
import './RaceLane.css';

function getProgress(cajasVendidas, objetivoCajas) {
  if (!objetivoCajas) {
    return 0;
  }

  return (cajasVendidas / objetivoCajas) * 100;
}

export default function RaceLane({ seller, rank }) {
  const progress = getProgress(seller.cajasVendidas, seller.objetivoCajas);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isOverGoal = progress > 100;
  const trackPosition = isOverGoal ? 94 : 5 + clampedProgress * 0.84;

  return (
    <article className="race-lane" style={{ '--lane-delay': `${rank * 75}ms` }}>
      <div className="race-lane__seller">
        <span className="race-lane__rank">{rank}</span>
        <strong>{seller.nombre}</strong>
      </div>
      <div className="race-lane__road">
        <div className="race-lane__progress" style={{ width: `${trackPosition}%` }} />
        <div
          className="race-lane__kart-position"
          style={{ '--kart-position': `${trackPosition}%` }}
        >
          <Kart seller={seller} isOverGoal={isOverGoal} />
          <span className="race-lane__boxes">{seller.cajasVendidas} cajas</span>
        </div>
      </div>
    </article>
  );
}
