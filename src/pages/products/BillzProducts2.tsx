import {
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Input,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useBillzGet } from "../../services/billz/query/useBillzGet";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { IoReload } from "react-icons/io5";
import { useBillzCreate } from "../../services/billz/mutation/useBillzCreate";

type objectType = {
  products:
    | [
        {
          id: string;
          barcode: string;
          brand_name: string;
          name: string;
          sku: string;
          supply_price: string;
          categories: { id: string; name: string; parent_id: string }[];
          product_supplier_stock: {
            max_supply_price: number;
            measurement_value: number;
            min_supply_price: number;
            retail_price: number;
            shop_id: string;
            supplier_id: string;
            supplier_name: string;
            wholesale_price: number;
          }[];
          shop_prices: {
            promo_price: number;
            promos: null | string | number;
            retail_currency: string;
            retail_price: number;
            shop_id: string;
            shop_name: string;
            supply_currency: string;
            supply_price: number;
          }[];
          shop_measurement_values: {
            active_measurement_value: number;
            shop_id: string;
            shop_name: string;
          }[];
          custom_fields: {
            custom_field_id: string;
            custom_field_name: string;
            custom_field_system_name: string;
            custom_field_value: string;
            from_parent: boolean;
          }[];
          photos: { photo_id: string; photo_url: string; primary: boolean }[];
        }
      ]
    | null;
  count: number;
};

export const BillzProducts2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 10;
  const initialTab = searchParams.get("tab") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const { data, refetch, isLoading, isFetching } = useBillzGet<objectType>({
    endpoint: "/v2/products",
    params: {
      shop_ids: "6c9cc178-a00b-44b3-a611-0e572074ddfe",
      limit: limit,
      search: searchValue,
      ...(searchValue ? {} : { page: currentPage }),
    },
  });

  const { mutate } = useBillzCreate({
    endpoint: "/v2/product-search-with-filters",
    queryKey: "",
  });

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">
        Billz mahsulotlar soni: <b className="text-back">{data?.count}</b> ta
      </h1>

      <Table
        size="large"
        bordered
        className="bg-white shadow-md rounded-xl"
        scroll={{ x: "max-content" }}
        dataSource={data?.products?.map((item) => ({ key: item.id, ...item }))}
        loading={isLoading || isFetching}
        title={() => (
          <Flex
            justify="space-between"
            align="center"
            className="p-3 bg-gray-100 rounded-lg"
          >
            <Input.Search
              size="large"
              placeholder="Ref bilan qidiring..."
              className="w-[550px]"
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={(value) => {
                setSearchValue(value);
                setSearchParams({
                  type: "billz",
                  page: String(currentPage),
                  limit: String(limit),
                  tab: initialTab,
                  search: value,
                });
              }}
            />
            <Button
              size="large"
              type="primary"
              className="bg-blue-600 hover:!bg-blue-700 px-6 rounded-lg shadow-md"
              onClick={() => refetch()}
              icon={<IoReload />}
            >
              Qayta yuklash
            </Button>
          </Flex>
        )}
        columns={[
          {
            width: "0",
            title: "№",
            render: (_, __, index) => (currentPage - 1) * limit + index + 1,
          },
          {
            title: "Rasm",
            dataIndex: "photos",
            render: (_, record) => (
              <div className="flex gap-2">
                {record.photos?.map((p: any, i: number) => (
                  <Image
                    key={i}
                    src={p.photo_url}
                    alt={record.name}
                    width={64}
                    height={64}
                    className="object-cover border rounded-lg shadow-sm"
                  />
                ))}
              </div>
            ),
          },
          {
            align: "center",
            title: "Ref",
            dataIndex: ["sku"],
            render: (_, record) => (
              <Typography.Paragraph copyable className="!m-0 !text-blue-600">
                {record.sku}
              </Typography.Paragraph>
            ),
          },
          {
            title: "Brend",
            dataIndex: "brand_name",
            render: (text) => <span className="font-medium">{text}</span>,
          },
          {
            title: "Nomi",
            dataIndex: "name",
            render: (text) => <span className="text-gray-700">{text}</span>,
          },
          {
            title: "Barcode",
            dataIndex: "barcode",
            render: (_, record) => (
              <Typography.Paragraph copyable className="!m-0 !text-gray-600">
                {record.barcode}
              </Typography.Paragraph>
            ),
          },
          {
            title: "Kategoriya",
            dataIndex: "categories",
            render: (category, record) => (
              <Tooltip
                title={
                  <>
                    {record.categories.map((cat) => (
                      <p key={cat.id} className="p-1 text-sm border-b">
                        {cat.name}
                      </p>
                    ))}
                  </>
                }
              >
                <span className="text-gray-700">
                  {record.categories[0].name}
                  {category.length > 1 && (
                    <span className="ml-1 text-blue-600">
                      +{category?.length - 1}
                    </span>
                  )}
                </span>
              </Tooltip>
            ),
          },
          {
            title: "Sotish Narxi",
            dataIndex: "shop_prices",
            render: (_, record) => (
              <Flex vertical gap={4}>
                {record.shop_prices.map((item) => (
                  <Flex key={item.shop_id}>
                    {item.shop_id == "0793974b-f85b-4c1d-b0e7-9ad7b921d588" && (
                      <span className="text-gray-700">
                        {item.shop_name}:{" "}
                        <b className="text-base text-green-600">
                          {formatPrice(item.retail_price, {
                            separator: ".",
                            withCurrency: false,
                          })}
                        </b>
                      </span>
                    )}
                  </Flex>
                ))}
              </Flex>
            ),
          },
          {
            title: "Ma’lumot",
            dataIndex: "custom_fields",
            render: (_, record) =>
              record.custom_fields.map((item) => (
                <p key={item.custom_field_id} className="text-sm text-gray-700">
                  {item.custom_field_name}:{" "}
                  <b className="text-gray-900">{item.custom_field_value}</b>
                </p>
              )),
          },
          {
            width: "0",
            align: "center",
            title: "Holati",
            dataIndex: "shop_prices",
            render: (_, record) => {
              const exists = record.shop_measurement_values.some(
                (item) =>
                  item.shop_id === "6c9cc178-a00b-44b3-a611-0e572074ddfe"
              );

              return exists ? (
                <Tag className="!text-base px-3 py-1" color="green">
                  Saytda bor
                </Tag>
              ) : (
                <Tag className="!text-base px-3 py-1" color="red">
                  Saytda yo‘q
                </Tag>
              );
            },
          },
          {
            width: 100,
            title: "Miqdori",
            dataIndex: "count",
            render: (_, record) => {
              const total = record.shop_measurement_values.reduce(
                (sum, item) => sum + item.active_measurement_value,
                0
              );

              return <div className="font-semibold">{total} шт</div>;
            },
          },
        ]}
        pagination={{
          size: "default",
          pageSize: limit,
          current: currentPage,
          showPrevNextJumpers: true,
          showQuickJumper: true,
          position: ["bottomCenter"],
          total: data?.count,
          onChange: (page, size) => {
            setCurrentPage(page);
            setLimit(size);
            setSearchParams({
              type: "billz",
              page: String(page),
              limit: String(size),
              tab: initialTab,
            });
          },
        }}
      />

      {/* Filter Drawer */}
      <Drawer
        title="Billz Mahsulot Filterlash"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setOpenFilterDrawer(false)}
        open={openFilterDrawer}
        placement="top"
        mask
      >
        <Form layout="vertical" className="space-y-4">
          <Flex gap={12} justify="space-between">
            <Form.Item className="w-full">
              <Input size="large" placeholder="Filter param 1" />
            </Form.Item>
            <Form.Item className="w-full">
              <Input size="large" placeholder="Filter param 2" />
            </Form.Item>
          </Flex>

          <Flex gap={12} justify="space-between">
            <Form.Item className="w-full">
              <Input size="large" placeholder="Filter param 3" />
            </Form.Item>
            <Form.Item className="w-full">
              <Input size="large" placeholder="Filter param 4" />
            </Form.Item>
          </Flex>

          <Form.Item>
            <Button
              block
              size="large"
              type="primary"
              className="bg-blue-600 hover:!bg-blue-700 rounded-lg"
              onClick={() =>
                mutate(
                  {
                    data: {
                      status: "all",
                      skus: ["106085"],
                      brand_ids: ["86785e4f-532f-4aaa-93c4-9d0884977e66"],
                      category_ids: ["9b994361-86d3-41c4-aad7-063c99378128"],
                      shop_ids: ["0b1f421c-3f0f-45e7-81db-878eaca958ed"],
                      supplier_ids: ["7e9b2da4-c83f-4039-ac5a-e00192ef2a25"],
                      group_variations: false,
                      statistics: true,
                      limit: 10,
                      page: 1,
                    },
                  },
                  {
                    onSuccess: (res) => {
                      console.log("Filtered Data: ", res);
                    },
                  }
                )
              }
            >
              Filterlash
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
