import { useState } from "react";
import { Tabs } from "antd";
import { BillzProducts } from "./pages/products/billz-products";
import { BillzProducts2 } from "./pages/products/BillzProducts2";

const { TabPane } = Tabs;

const App = () => {
  const [activeTab, setActiveTab] = useState<string>("1");

  return (
    <div className="p-4">
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Billz Products Dizayn 1" key="1">
          <BillzProducts />
        </TabPane>
        <TabPane tab="Billz Products Dizayn 2" key="2">
          <BillzProducts2 />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
