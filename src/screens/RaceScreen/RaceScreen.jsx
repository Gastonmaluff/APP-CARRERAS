import RaceTrack from '../../components/RaceTrack/RaceTrack.jsx';
import { MOCK_SALES_DATA } from '../../data/MockSalesData.js';
import './RaceScreen.css';

export default function RaceScreen() {
  const sellers = [...MOCK_SALES_DATA].sort(
    (sellerA, sellerB) => sellerB.cajasVendidas - sellerA.cajasVendidas,
  );

  return (
    <main className="race-screen" aria-label="Carrera de ventas mensual">
      <div className="race-skyline" aria-hidden="true" />
      <header className="race-header">
        <div>
          <p className="race-kicker">Objetivo del Mes</p>
          <h1>Carrera de Ventas</h1>
        </div>
        <div className="race-goal">
          <span>Meta</span>
          <strong>60 cajas</strong>
        </div>
      </header>
      <RaceTrack sellers={sellers} />
    </main>
  );
}
