import { Link } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";

export default function Home() {
  return (
    <>
      <Container title="Smart Kirana">
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-gray-600">
            Simple app for <b>Udhaar</b> + <b>Stock</b>
          </p>

          <div className="mt-5 grid gap-3">
            <Link
              to="/khata"
              className="rounded-2xl bg-black px-4 py-4 text-center text-white font-semibold active:scale-[0.99]"
            >
              📒 Khata (Udhaar)
            </Link>

            <Link
              to="/stock"
              className="rounded-2xl bg-white border px-4 py-4 text-center font-semibold active:scale-[0.99]"
            >
              📦 Stock (Low Items)
            </Link>

            <Link
              to="/customers"
              className="rounded-2xl bg-white border px-4 py-4 text-center font-semibold active:scale-[0.99]"
            >
              👤 Customers
            </Link>
          </div>
        </div>
      </Container>
      <BottomNav />
    </>
  );
}