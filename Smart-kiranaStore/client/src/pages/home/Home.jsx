import { useEffect, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SummaryAPI } from "../../services/summary.api";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
  });

  const load = async () => {
    try {
      const res = await SummaryAPI.get();
      setData(res);
    } catch (e) {
      console.log("Summary error", e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Container title="Smart Kirana Dashboard">
        <div className="grid gap-3">

          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Total Customers</div>
            <div className="text-3xl font-bold">{data.totalCustomers}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Total Baki</div>
            <div className="text-3xl font-bold">₹ {data.totalBaki}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Low Stock Items</div>
            <div className="text-3xl font-bold">{data.lowStockCount}</div>
          </div>

          <Link
            to="/khata"
            className="mt-3 rounded-2xl bg-black py-3 text-center text-white font-semibold"
          >
            📒 Go to Khata
          </Link>

          <Link
            to="/stock"
            className="rounded-2xl border py-3 text-center font-semibold"
          >
            📦 Go to Stock
          </Link>

        </div>
      </Container>

      <BottomNav />
    </>
  );
}