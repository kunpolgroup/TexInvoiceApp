import {
  Input,
  Typography,
  Button,
  IconButton,
  Card,
  CardFooter,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import Select from "react-select";

import moment from "moment";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState, useEffect } from "react";

import { AiFillDelete, AiOutlineStop } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

import { BsFillEyeFill, BsPlusCircle } from "react-icons/bs";
import { MdLocalPrintshop } from "react-icons/md";
import { TbDoorEnter } from "react-icons/tb";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  createInvoiceStore,
  // productStore,
  // customerStore,
  shopStore,
  headFormStore,
  companyLoginStore,
} from "../../../../store/Store";

import ReceiptA4Short from "../../../receipt/receiptA4Short";
import Receipt80Short from "../../../receipt/receipt80Short";

import {
  deleteShortInvoice,
  getShortInvoice,
} from "../../../../api/TaxShortInvoiceApi";

function TaxInvoiceShort() {
  // import Data Store

  const companyLoginDataStore = useRecoilValue(companyLoginStore);

  //----------  Data Table --------------------//
  const [noData, setNoData] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] =
    useRecoilState(createInvoiceStore);
  const shopDataStore = useRecoilValue(shopStore);

  const shopOptions = shopDataStore?.map((shop) => ({
    value: shop.id,
    label: shop.salepoints_name,
  }));

  const [selectedShop, setSelectedShop] = useState(null);
  const [sendShop, setSendShop] = useState("");

  const handleShopSelect = (e) => {
    // ตรวจสอบว่า e.value ไม่เป็น undefined หรือ null
    if (e && e.value !== undefined && e.value !== null) {
      // ค้นหาข้อมูลร้านที่ถูกเลือกจาก shopDataStore
      const shop = shopDataStore.find((shop) => shop.id === e.value);

      // ตรวจสอบว่า shop ไม่เป็น undefined ก่อนที่จะเข้าถึง property
      if (shop) {
        // เซ็ตข้อมูลร้านที่ถูกเลือกใน state
        setSelectedShop(shop.salepoints_name);
        setSendShop(Number(shop.id));
      } else {
        // กรณีไม่พบข้อมูลร้าน
        console.error(`Shop with ID ${e.value} not found in shopDataStore`);
      }
    } else {
      // กรณี e.value เป็น undefined หรือ null
      setSendShop("");
    }
  };

  console.log(selectedShop);

  const [listData, setListData] = useState([]);

  const [tokenError, setTokenError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchable, setIsSearchable] = useState(true);

  const fetchShortInvoice = async () => {
    try {
      const response = await getShortInvoice(searchQuery, sendShop);
      console.log(response);
      setListData(response);
      setNoData(false);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchShortInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, openCreateInvoice, sendShop]);

  useEffect(() => {
    if (tokenError) {
      localStorage.clear();
      window.location.reload();
    }
  }, [tokenError]);

  //----- จัดการแสดงข้อมูล / หน้า -------------- //
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = Array.isArray(listData)
    ? listData.slice(startIndex, endIndex)
    : [];

  const totalPages = Math.ceil(listData.length / itemsPerPage);

  //------------- modal View Product -----------------------//
  const [openModalView, setOpenModalView] = useState(false);
  const [dataView, setDataView] = useState([]);
  const handleModalView = (data) => {
    setOpenModalView(!openModalView);
    setDataView(data);
  };

  //------------- modal Add Invoice -----------------------//

  const [headFormDataStore, setHeadFormDataStore] =
    useRecoilState(headFormStore);
  const handleModalAdd = () => {
    setHeadFormDataStore("2");
    setOpenCreateInvoice(true);
  };

  //------------- modal Delete Product -----------------------//

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [dataDelete, setDataDelete] = useState([]);

  const handleModalDelete = (data) => {
    setOpenModalDelete(!openModalDelete);
    setDataDelete(data);
  };

  const handleDelete = async (id) => {
    // console.log(id);
    try {
      const response = await deleteShortInvoice(id, setToastOpen);
      // console.log(response);
      fetchShortInvoice();
      setOpenModalDelete(false);
    } catch (error) {
      toast.error("ลบ ใบกำกับภาษี(รูปแบบย่อ) ไม่สำเร็จ  กรุณาลองใหม่");
    }

    // console.log(id);
  };

  //------------- open Receipt A4  -----------------------//
  const [openModalReceiptA4, setOpenModalReceiptA4] = useState(false);
  const handleModalReceiptA4 = () => {
    setOpenModalReceiptA4(!openModalReceiptA4);
  };

  //------------- open Receipt 80  -----------------------//
  const [openModalReceipt80, setOpenModalReceipt80] = useState(false);
  const handleModalReceipt80 = () => {
    setOpenModalReceipt80(!openModalReceipt80);
  };

  return (
    <div className="w-full overflow-auto  px-3">
      <div className="w-full px-3">
        {/* <p>ข้อมูลผู้บริจาค</p> */}
        <div className="flex flex-col sm:flex-row w-full items-center gap-3   sm:justify-between px-5 mt-5   ">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex justify-center  ">
              <Input
                type="text"
                color="blue"
                label="ค้นหา เลขใบกำกับภาษี"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // className=" bg-gray-50"
                style={{ backgroundColor: "#F4F4F4" }}
              />
            </div>

            <div className="flex justify-center items-baseline gap-2 ">
              <div>
                <Typography className="flex justify-end  items-baseline align-text-bottom font-bold min-w-[90px] ">
                  เลือกจุดขาย:
                </Typography>
              </div>
              <div className="w-full">
                <Select
                  className="basic-single   "
                  classNamePrefix="select"
                  placeholder="เลือกจุดขาย"
                  isClearable
                  isSearchable={isSearchable}
                  name="color"
                  options={shopOptions}
                  onChange={(e) => handleShopSelect(e)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="gradient"
              color="green"
              className="text-base flex justify-center  items-center   bg-green-500"
              onClick={handleModalAdd}
            >
              <span className="mr-2 text-xl">
                <BsPlusCircle />
              </span>
              สร้างใบกำกับภาษี (รูปแบบย่อ)
            </Button>
          </div>
        </div>
        {/* ------------ table  ----------------------------------------- */}
        <Card className="mt-5 mx-10 border-2 overflow-auto ">
          <div className="p-3">
            <table className="w-full min-w-max  ">
              <thead>
                <tr>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 w-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      ลำดับ
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      ใบกำกับภาษี
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 w-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      ดู
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 w-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none opacity-70"
                    >
                      ลบ
                    </Typography>
                  </th>
                </tr>
              </thead>
              {listData?.length <= 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <Typography className="text-center mt-5">
                        ...ไม่พบข้อมูล...
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {displayedData.map((data, index) => {
                    const isLast = index === displayedData.length - 1;
                    const pageIndex = startIndex + index;
                    const classes = isLast
                      ? "p-2"
                      : "p-3 border-b border-blue-gray-50";

                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <div className="flex items-center justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal "
                            >
                              {pageIndex + 1 || ""}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal "
                            >
                              {data?.code || ""}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex justify-center">
                            <IconButton
                              variant="outlined"
                              color="blue"
                              size="sm"
                              className="ml-3 "
                              onClick={() => handleModalView(data)}
                            >
                              <BsFillEyeFill className="h-5 w-5  text-light-blue-700 " />
                            </IconButton>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex justify-center ">
                            <IconButton
                              variant="outlined"
                              size="sm"
                              color="red"
                              className="rounded-full"
                              onClick={() => handleModalDelete(data)}
                            >
                              <AiFillDelete color="red" className="h-5 w-5" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ก่อนหน้า
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <IconButton
                  key={i}
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                  }
                >
                  {i + 1}
                </IconButton>
              ))}
            </div>
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ถัดไป
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* modal View Receipt */}

      <Dialog
        open={openModalView}
        size="xl"
        // handler={handleModalView}
        className="h-[82vh]"
      >
        <DialogHeader className="bg-blue-700 py-3  px-3 text-center text-lg text-white opacity-80">
          <div className="flex gap-3">
            <Typography variant="h5">รายละเอียด:</Typography>
            <Typography variant="h5" className=" font-normal">
              {dataView?.product_name || ""}
            </Typography>
          </div>
        </DialogHeader>
        <DialogBody divider className=" overflow-auto h-[65vh] ">
          <div className="flex w-full flex-col xl:flex-row  gap-4 ">
            <div className="w-full lg:w-4/12 ">
              <div className="flex flex-col 2xl:flex-row  gap-1">
                <div>
                  <Typography className="flex w-full sm:text-lg  font-bold">
                    ใบเสร็จรับเงิน / ใบกำกับภาษี
                  </Typography>
                </div>
                <div>
                  <Typography className="flex w-full sm:text-lg  font-bold">
                    (รูปแบบย่อ){" "}
                  </Typography>
                </div>
              </div>
              <Typography className="font-bold mt-5">
                เลขที่ใบกำกับภาษี:{" "}
                <span className="font-normal">{dataView?.code}</span>
              </Typography>
              <Typography className="font-bold mt-5">
                วันที่:{" "}
                <span className="font-normal">
                  {moment(dataView?.created_at).format("DD/MM/YYYY  ")}
                </span>{" "}
              </Typography>
              <Typography className="font-bold mt-5">
                จุดขาย:{" "}
                <span className="font-normal">{dataView?.salepoints_name}</span>{" "}
              </Typography>
              <hr className="mt-3 border " />
              <div className="flex  flex-col  mt-3">
                <Typography className="text-lg font-bold">
                  ข้อมูลการชำระเงิน
                </Typography>
                <Typography className="mt-3">
                  รวมเงิน: {Number(dataView?.total_price).toLocaleString()} บาท
                </Typography>
                <Typography className="mt-3">
                  ภาษีมูลค่าเพิ่ม:{" "}
                  {Number(dataView?.total_tax).toLocaleString()} บาท
                </Typography>
                <Typography className="mt-3 font-bold text-lg text-red-500">
                  จำนวนเงินทั้งสิน:{" "}
                  {Number(dataView?.total_amount).toLocaleString()} บาท
                </Typography>
                <hr className="mt-3 border " />
                <Typography className="text-lg font-bold mt-1">
                  หมายเหตุ:{" "}
                  <span className="font-normal">{dataView?.note}</span>
                </Typography>
              </div>
            </div>
            <div className="w-full lg:w-8/12">
              <Typography className="text-center font-bold text-lg">
                รายการ
              </Typography>
              <Card className="border px-2 h-[97%] overflow-auto mt-5">
                <div className="mt-5">
                  <table className="w-full min-w-max  ">
                    <thead>
                      <tr>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70"
                          >
                            ลำดับ
                          </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70  "
                          >
                            รายการ
                          </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70"
                          >
                            จำนวน
                          </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70"
                          >
                            หน่วยนับ
                          </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70"
                          >
                            ราคา/หน่วย
                          </Typography>
                        </th>
                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none opacity-70"
                          >
                            รวมเงิน
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    {noData ? (
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Typography>...ไม่พบข้อมูล...</Typography>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {dataView?.product_data?.map((data, index) => {
                          const classes = "p-3 border-b border-blue-gray-50";

                          return (
                            <tr key={index}>
                              <td className={classes}>
                                <div className="flex items-center justify-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {index + 1 || ""}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center justify-center ">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {data?.product || ""}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center justify-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {data?.quantity || ""}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center justify-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {data?.unit || ""}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center justify-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {Number(
                                      data?.pricePerUnit
                                    ).toLocaleString() || ""}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center justify-center">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal "
                                  >
                                    {Number(
                                      data?.totalPrice
                                    ).toLocaleString() || ""}
                                  </Typography>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </DialogBody>
        <DialogFooter divider >
          <div className="flex gap-3">
            <Menu className="text-base flex justify-center  items-center   ">
              <MenuHandler>
                <Button
                  size="sm"
                  className="text-base flex justify-center  items-center   bg-green-500"
                  variant="gradient"
                  color="blue"
                >
                  <span className="mr-2 text-xl ">
                    <MdLocalPrintshop />
                  </span>
                  พิมพ์{" "}
                </Button>
              </MenuHandler>

              <MenuList className="menu-list-class">
                <MenuItem onClick={handleModalReceiptA4}>ขนาด A4</MenuItem>
                <MenuItem onClick={handleModalReceipt80}>ขนาด 80 มิล</MenuItem>
              </MenuList>
            </Menu>

            <div className="flex">
              <Button
                variant="gradient"
                color="gray"
                size="sm"
                onClick={handleModalView}
                className="flex mr-1 text-base "
              >
                <span className="mr-2 text-xl ">
                  <TbDoorEnter />
                </span>
                ออก
              </Button>
            </div>
          </div>
        </DialogFooter>
      </Dialog>

      {/* modal Delete Product */}

      <Dialog open={openModalDelete} size="sm" handler={handleModalDelete}>
        <DialogHeader className="bg-red-700 py-3  px-3  justify-center text-lg text-white opacity-80">
          <Typography variant="h5">ลบสินค้า</Typography>
        </DialogHeader>
        <DialogBody divider className=" overflow-auto ">
          <div className="flex flex-col w-full justify-center gap-3 ">
            <Typography variant="h5" className="text-center">
              ต้องการลบ ใบกำกับภาษี: {dataDelete?.code || ""}{" "}
            </Typography>
            <Typography variant="h5" className="text-center">
              จริงหรือไม่?{" "}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className=" flex w-full justify-center  gap-5 ">
            <Button
              variant="gradient"
              color="red"
              size="sm"
              onClick={() => handleDelete(dataDelete?.id)}
              className="flex mr-1 text-base"
            >
              <span className="text-xl mr-2">
                <FaCheckCircle />
              </span>
              ตกลง
            </Button>
            <Button
              variant="gradient"
              color="blue-gray"
              size="sm"
              onClick={handleModalDelete}
              className="flex mr-1 text-base"
            >
              <span className="text-xl mr-2">
                <AiOutlineStop />
              </span>
              ยกเลิก
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* open PDF A4 */}
      {openModalReceiptA4 == true ? (
        <ReceiptA4Short
          openModalReceiptA4={openModalReceiptA4}
          handleModalReceiptA4={handleModalReceiptA4}
          dataReceipt={dataView}
          companyLoginDataStore={companyLoginDataStore}
        />
      ) : (
        ""
      )}

      {/* open PDF  80 */}
      {openModalReceipt80 == true ? (
        <Receipt80Short
          openModalReceipt80={openModalReceipt80}
          handleModalReceipt80={handleModalReceipt80}
          dataReceipt={dataView}
          companyLoginDataStore={companyLoginDataStore}
        />
      ) : (
        ""
      )}

      {toastOpen == true ? (
        <ToastContainer className="mt-10" autoClose={100} theme="colored" />
      ) : (
        ""
      )}
    </div>
  );
}

export default TaxInvoiceShort;
