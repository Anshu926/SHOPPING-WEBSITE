import { useEffect, useState } from "react";
import api from "../api";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/products")
      .then((res) => {
        if (!mounted) return;
        setProducts(res.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.error || "Could not load products.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading, error };
}
