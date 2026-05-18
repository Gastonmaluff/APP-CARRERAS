import RaceLane from '../RaceLane/RaceLane.jsx';
import './RaceTrack.css';

export default function RaceTrack({ sellers }) {
  return (
    <section className="race-track" aria-label="Pista de carrera">
      <div className="race-track__surface">
        <div className="race-track__finish" aria-hidden="true">
          <span>META</span>
        </div>
        {sellers.map((seller, index) => (
          <RaceLane key={seller.id} seller={seller} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
