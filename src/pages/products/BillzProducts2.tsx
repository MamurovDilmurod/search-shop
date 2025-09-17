import { Button, Flex, Image, Input, Table, Typography } from "antd";
import { useBillzGet } from "../../services/billz/query/useBillzGet";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { IoReload } from "react-icons/io5";

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

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Sarlavha */}
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Billz mahsulotlar soni:{" "}
        <span className="px-2 py-1 text-white bg-blue-600 rounded-md">
          {data?.count}
        </span>{" "}
        ta
      </h1>

      <Table
        size="large"
        bordered={false}
        className="bg-white shadow-lg rounded-xl"
        scroll={{ x: "max-content" }}
        dataSource={data?.products?.map((item) => ({ key: item.id, ...item }))}
        loading={isLoading || isFetching}
        title={() => (
          <Flex
            justify="space-between"
            align="center"
            vertical
            className="flex-col gap-3 p-4 bg-gray-100 rounded-lg sm:flex-row"
          >
            {/* Qidiruv input */}
            <Input.Search
              size="large"
              placeholder="Ref bilan qidiring..."
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
              className="
                w-full
                sm:w-[500px]
                shadow-md
                rounded-lg
                focus:!border-blue-500
                focus:!ring-2
                focus:!ring-blue-300
                transition-all
              "
            />

            {/* Qayta yuklash tugmasi */}
            <Button
              size="large"
              type="primary"
              className="
                w-full 
                sm:w-auto
                bg-blue-600 
                hover:!bg-blue-700 
                px-6 
                rounded-lg 
                shadow-md
                flex items-center gap-2
              "
              onClick={() => refetch()}
              icon={<IoReload />}
            >
              Qayta yuklash
            </Button>
          </Flex>
        )}
        columns={[
          {
            width: "5%",
            title: "№",
            align: "center",
            render: (_, __, index) => (
              <span className="font-medium text-gray-700">
                {(currentPage - 1) * limit + index + 1}
              </span>
            ),
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
            title: "Nomi",
            dataIndex: "name",
            render: (text) => (
              <span className="font-medium text-gray-800">{text}</span>
            ),
          },
          {
            align: "center",
            title: "Ref",
            dataIndex: ["sku"],
            render: (_, record) => (
              <Typography.Paragraph
                copyable
                className="!m-0 !text-blue-600 font-semibold"
              >
                {record.sku}
              </Typography.Paragraph>
            ),
          },
          {
            title: "Yetkazib berish narxi",
            dataIndex: "supply_price",
            render: (_, record) => {
              const price =
                record?.product_supplier_stock?.[0]?.max_supply_price;
              const formattedPrice = price
                ? new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
                : "-";

              return (
                <span className="px-2 py-1 font-semibold text-green-700 bg-green-100 rounded-md">
                  {formattedPrice}
                </span>
              );
            },
          },
          {
            title: "Sotish Narxi",
            dataIndex: "shop_prices",
            render: (_, record) => (
              <Flex vertical gap={4}>
                {record.shop_prices.map((item) => (
                  <Flex key={item.shop_id}>
                    {item.shop_id ===
                      "0793974b-f85b-4c1d-b0e7-9ad7b921d588" && (
                      <span className="px-2 py-1 font-semibold text-blue-700 bg-blue-100 rounded-md">
                        {formatPrice(item.retail_price, { separator: "." })}
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
                <p
                  key={item.custom_field_id}
                  className="text-sm leading-5 text-gray-600"
                >
                  {item.custom_field_name}:{" "}
                  <b className="text-gray-900">{item.custom_field_value}</b>
                </p>
              )),
          },
          {
            width: 100,
            title: "Miqdori",
            dataIndex: "count",
            align: "center",
            render: (_, record) => {
              const total = record.shop_measurement_values.reduce(
                (sum, item) => sum + item.active_measurement_value,
                0
              );
              return (
                <span className="font-semibold text-gray-800">{total} шт</span>
              );
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
    </div>
  );
};
