import RaceTrack from '../../components/RaceTrack/RaceTrack.jsx';
import { useRaceConfig } from '../../hooks/useRaceConfig.js';
import './RaceScreen.css';

export default function RaceScreen() {
  const { config } = useRaceConfig();
  const { settings, sellers: editableSellers } = config;
  const sellers = [...editableSellers].sort(
    (sellerA, sellerB) => sellerB.cajasVendidas - sellerA.cajasVendidas,
  );

  return (
    <main className="race-screen" aria-label="Carrera de ventas mensual">
      <div className="race-skyline" aria-hidden="true" />
      <header className="race-header">
        <div>
          <p className="race-kicker">{settings.subtitle}</p>
          <h1>{settings.title}</h1>
        </div>
        <div className="race-goal">
          <span>{settings.goalLabel}</span>
          <strong>{settings.goalBoxes} cajas</strong>
        </div>
      </header>
      <RaceTrack sellers={sellers} />
    </main>
  );
}
