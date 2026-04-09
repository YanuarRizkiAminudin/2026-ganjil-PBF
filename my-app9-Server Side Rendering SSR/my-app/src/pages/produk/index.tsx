import { useEffect, useState } from "react";
import TampilanProduk from "../../views/product";

const kategori = () => {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   if (!isLogin) {
  //     push("/auth/login");
  //   }
  // }, []);

  useEffect(() => {
    fetch("/api/produk")
      .then((response) => response.json())
      .then((responsedata) => {
        setProducts(responsedata.data);
        // console.log("Data produk:", responsedata.data);
      })
      .catch((error) => {
        console.error("Error fetching produk:", error);
      });
  }, []);

  return (
    <div>
      <TampilanProduk products={products} />
    </div>
  );
};

export default kategori;