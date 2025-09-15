import { useState } from "react";
import {
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Image,
} from "antd";

const { Title } = Typography;

// Product interfeysi
interface Product {
  id: number;
  title: string;
  thumbnail: string;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      message.warning("Mahsulot nomini yozing!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      const data = await res.json();
      setProducts(data.products as Product[]);
      if (data.products.length === 0) {
        message.info("Hech qanday mahsulot topilmadi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      message.error("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px" }}>
      <div style={{ maxWidth: "1400", margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "left", color: "#1677ff" }}>
          Mahsulot Qidirish
        </Title>

        {/* Input va Button */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          <Input
            placeholder="Mahsulot nomini yozing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="large"
          />
          <Button
            type="primary"
            size="large"
            onClick={handleSearch}
            loading={loading}
          >
            Qidirish
          </Button>
        </div>

        {/* Natijalar */}
        <Row gutter={[16, 16]}>
          {products.length > 0 ? (
            products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={product.title}
                      src={product.thumbnail}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta title={product.title} />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", color: "gray" }}>
              Mahsulot topilmadi yoki qidiruv hali qilinmadi.
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default App;
