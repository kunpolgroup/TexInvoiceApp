/* eslint-disable react-hooks/exhaustive-deps */
import {
    Input,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Card,
  } from "@material-tailwind/react";
  
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  
  import moment from "moment/min/moment-with-locales";
  
  import Select from "react-select";
  
  import { IoIosSave } from "react-icons/io";
  import { MdLocalPrintshop, MdRemoveCircle } from "react-icons/md";
  import { TbLogout2 } from "react-icons/tb";
  import { BsPlusCircle } from "react-icons/bs";
  
  import { useEffect, useState } from "react";
  
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import th from "date-fns/locale/th";
  
  
  import { useRecoilState, useRecoilValue } from "recoil";
  import {
    editInvoiceStore,
    dataEditInvoiceStore,
    productStore,
    customerStore,
    shopStore,
    headFormStore,
    companyLoginStore,
  } from "../../../../store/Store";
  
  import ReceiptA4 from "../../../receipt/receiptA4";
  import Receipt80 from "../../../receipt/receipt80";
  import ReceiptA4Short from "../../../receipt/receiptA4Short";
  import Receipt80Short from "../../../receipt/receipt80Short";
  import ReceiptSubFull from "../../../receipt/receiptSubFull";
  import ReceiptSubShort from "../../../receipt/receiptSubShort";
  
  import { editFullInvioce } from "../../../../api/TaxFullInvoiceAPI";
  import { editShortInvioce } from "../../../../api/TaxShortInvoiceApi";
  import { editSubInvioce } from "../../../../api/TaxSubInvoiceApi";
  
  const EditInvoice = () => {
    // import Data Store
    const [openEditInvoice, setOpenEditInvoie] =
      useRecoilState(editInvoiceStore);
    const [dataEditInvoice, setDataEditInvoice] =
      useRecoilState(dataEditInvoiceStore);
    const productDataStore = useRecoilValue(productStore);
    const customerDataStore = useRecoilValue(customerStore);
    const shopDataStore = useRecoilValue(shopStore);
    const headFormDataStore = useRecoilValue(headFormStore);
    const companyLoginDataStore = useRecoilValue(companyLoginStore);
  
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [select, setSelect] = useState("");
    const [searchQueryStart, setSearchQueryStart] = useState(new Date());
  
    const [openPrint, setOpenPrint] = useState(false);
  
    const [note, setNote] = useState("");
  
    const columns = [
      "ลำดับ",
      "รายการ",
      "จำนวน",
      "หน่วย",
      "ราคา/หน่วย",
      "รวมเงิน",
      "ลบ",
      headFormDataStore == "3" ? "จำนวนบิลย่อย" : null,
      headFormDataStore == "3" ? "พิมพ์" : null,
    ];
    const [data, setData] = useState(dataEditInvoice?.product_data);
    const selectedProductIds = data?.map((item) => item.category); // ดึง ID ของสินค้าที่ถูกเลือกไปแล้วในตาราง


  
    // กรองสินค้าที่ยังไม่ถูกเลือกออกจาก productDataStore
  
    const unselectedProducts = Array.isArray(productDataStore)
      ? productDataStore.filter(
          (product) => !selectedProductIds.includes(product.id)
        )
      : [];
  
    const productOptions = unselectedProducts?.map((product) => ({
      value: product.id,
      label: product.name,
    }));

    const customerOptions = Array.isArray(customerDataStore)
      ? customerDataStore?.map((customer) => ({
          value: customer.id,
          label: customer.customer_name,
        }))
      : [];
  
      
    const shopOptions = shopDataStore?.map((shop) => ({
      label: shop.salepoints_name,
      value: shop.id,
    }));
  
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleCustomerSelect = (e) => {
      // ค้นหาข้อมูลลูกค้าที่ถูกเลือกจาก customerDataStore
      const customer = customerDataStore?.find(
        (customer) => customer.id === e.value
      );
      // เซ็ตข้อมูลลูกค้าที่ถูกเลือกใน state
      // console.log(customer);
      setSelectedCustomer(customer);
    };
  
    // const [selectedShop, setSelectedShop] = useState(null);
    const [selectedShop, setSelectedShop] = useState(
      {
       label: dataEditInvoice?.salepoints_name,
        value: dataEditInvoice?.salepoints_id
      }
      );

    const handleShopSelect = (e) => {
      // ค้นหาข้อมูลลูกค้าที่ถูกเลือกจาก customerDataStore
      const shop = shopDataStore.find((shop) => shop.id === e.value);
      // เซ็ตข้อมูลลูกค้าที่ถูกเลือกใน state
      console.log(shop);
      if(e.value) {
        setSelectedShop({label:shop?.salepoints_name , value:shop?.id});
      }else{
        return
      }
    };
  
    // console.log(selectedShop)
  
    // const [selectValues, setSelectValues] = useState([{
    //     label:dataEditInvoice?.product_data[0]?.product ,
    //     value: 0
    // }]);

    const [selectValues, setSelectValues] = useState(() => {
        return dataEditInvoice?.product_data.map((product, index) => ({
          label: product?.product,
          value: index
        })) || [];
      });
    console.log(selectValues)
  
    const handleChange = (value, index) => {
      // ตรวจสอบว่ามีค่าที่ถูกเลือกอยู่แล้วหรือไม่
      const isValueExist = selectValues.some(
        (val, i) => val && val.value === value.value && i !== index
      );
  
      if (!isValueExist) {
        const updatedData = [...data];
        updatedData[index] = {
          ...updatedData[index],
          category: value ? value.value : null,
        };
  
        // ค้นหาข้อมูลสินค้าที่ถูกเลือกจาก productDataStore
        const selectedProduct = productDataStore?.find(
          (product) => product.id === value.value
        );
  
        // ตรวจสอบว่าเจอสินค้าที่ถูกเลือกหรือไม่
        if (selectedProduct) {
          updatedData[index].unit = selectedProduct.unit; // เก็บหน่วยนับ
          updatedData[index].pricePerUnit = selectedProduct.price; // เก็บราคาต่อหน่วย
          updatedData[index].product = selectedProduct.name; // เก็บชื่อสินค้า
  
          // Update selectValues here
          const newSelectValues = [...selectValues];
          newSelectValues[index] = value;
          setSelectValues(newSelectValues);
  
          // Calculate total price here
          updatedData[index].totalPrice = calculateTotal(
            updatedData[index].quantity,
            selectedProduct.price
          );
        }
  
        setData(updatedData);
  
        const newSelectValues = [...selectValues];
        newSelectValues[index] = value;
        setSelectValues(newSelectValues);
      } else {
        toast.error("สินค้าซ้ำกัน กรุณาเลือกสินค้าใหม่");
        // หรือสามารถทำการจัดการอื่น ๆ ตามความเหมาะสมได้ เช่น แสดงข้อความเตือน
      }
    };
  
    const handleAddRow = () => {
      const newData = {
        id: data.length + 1,
        name: `Item ${data.length + 1}`,
        category: null,
      };
      setData([...data, newData]);
      setSelectValues([...selectValues, null]);
    };
  
    const handleDeleteRow = (index) => {
      const updatedData = data.filter((item, i) => i !== index);
      setData(updatedData);
  
      const newSelectValues = [...selectValues];
      newSelectValues.splice(index, 1);
      setSelectValues(newSelectValues);
      toast.success("ลบข้อมูลสินค้าสำเร็จ");
    };
  
    const handleQuantityChange = (e, index) => {
      const newQuantity = parseInt(e, 10);
      const updatedData = [...data];
      const selectedProduct = productDataStore?.find(
        (product) => product.id === updatedData[index]?.category
      );
  
      if (selectedProduct) {
        updatedData[index] = {
          ...updatedData[index],
          quantity: newQuantity,
          totalPrice: calculateTotal(newQuantity, selectedProduct.price),
          amountBill: Math.ceil(
            calculateTotal(newQuantity, selectedProduct.price) / 900
          ),
        };
        setData(updatedData);
      }
    };
  
    const handleBillChange = (e, index) => {
      const newBill = parseInt(e, 10);
      const updatedData = [...data];
      const selectedProduct = productDataStore.find(
        (product) => product.id === updatedData[index]?.category
      );
  
      if (selectedProduct) {
        updatedData[index] = {
          ...updatedData[index],
          amountBill: Number(newBill),
        };
        setData(updatedData);
      }
    };
  
    // console.log(data);
  
  
   // ฟังก์ชันคำนวณรวมเงิน
   const calculateTotal = (quantity, pricePerUnit) => {
    return isNaN(quantity) || isNaN(pricePerUnit) ? 0 : quantity * pricePerUnit;
  };
  
  const calculateTotalAmount = () => {
    let subtotal = 0;
    data.forEach((item) => {
      if (!isNaN(item.totalPrice)) {
        subtotal += item.totalPrice;
      }
    });
    return subtotal;
  };
  
  const calculatePruePrice = () => {
    const subtotal = calculateTotalAmount();
    return (subtotal / 1.07);
  };
  
  const calculateVAT = () => {
    const subtotal = calculateTotalAmount();
    const pruePrice = calculatePruePrice();
    return subtotal - pruePrice;
  };
  
  const calculateTotalUnit = () => {
    let subtotal = 0;
    data.forEach((item) => {
      if (!isNaN(item.quantity)) {
        subtotal += item.quantity;
      }
    });
    return subtotal;
  };
  
  
    const [dataReceipt, setDataReceipt] = useState("");
    const [dataViewSub, setDataViewSub] = useState([]);

    // console.log(data)
    console.log(dataEditInvoice)
    console.log(selectedShop)
    
  
    const handleSendReceipt = async () => {
      console.log(selectedShop)
      try {
        let datasend = {
          ...(headFormDataStore == "1"
            ? { customer_id: Number(selectedCustomer?.id) }
            : {}),
          ...(headFormDataStore != "3"
            ? {
                product_data: data,
                id: Number(dataEditInvoice?.id),
                created_at: startDate,
                total_price: Number(calculatePruePrice().toFixed(2)),
                total_tax: Number(calculateVAT().toFixed(2)),
                total_amount: Number(calculateTotalAmount().toFixed(2)),
                note: note,
                salepoint_id: Number(selectedShop?.value)
              }
            : {}),
          ...(headFormDataStore == "3"
            ? {
                invoice_data: {
                  id: dataEditInvoice?.id,
                  product_data: data,
                  created_at: startDate,
                  total_price: Number(calculatePruePrice().toFixed(2)),
                  total_tax: Number(calculateVAT().toFixed(2)),
                  total_amount: Number(calculateTotalAmount().toFixed(2)),
                  note: note,
                  ...(headFormDataStore == "3"
                    // ? { salepoint: Number(selectedShop.id) }
                    ? { salepoint_id: Number(selectedShop?.value)}
                    : {}),
                },
              }
            : {}),
          ...(headFormDataStore == "3" ? { subinvoices_data: data } : {}),
        };
        if (headFormDataStore == "1") {
          const response = await editFullInvioce(datasend, setOpenPrint);
          console.log(response)
          setDataReceipt(response);
        } else if (headFormDataStore == "2") {
          console.log(datasend)
          const response = await editShortInvioce(datasend, setOpenPrint);
          // console.log(response)
          setDataReceipt(response);
        } else if (headFormDataStore == "3") {
          console.log(datasend);
          const response = await editSubInvioce(
            JSON.stringify(datasend),
            setOpenPrint
          );
          // console.log(response);
          setDataReceipt(response);
          setDataViewSub(response);
        }
      } catch (error) {
        toast.error(error);
      }
    };
  
    // console.log(openPrint)
  
    const handleout = () => {
      setOpenEditInvoie(!openEditInvoice);
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
  
    const [printIndex, setPrintIndex] = useState("");
  
    //------------- open Receipt A4 Sub  -----------------------//
    const [openModalReceiptSubFull, setOpenModalReceiptSubFull] = useState(false);
    const handleModalReceiptSubFull = (index) => {
      setOpenModalReceiptSubFull(!openModalReceiptSubFull);
      setPrintIndex(index);
    };
  
    //------------- open Receipt 80 Sub  -----------------------//
    const [openModalReceiptSubShort, setOpenModalReceiptSubShort] =
      useState(false);
    const handleModalReceiptSubShort = (index) => {
      setOpenModalReceiptSubShort(!openModalReceiptSubShort);
      setPrintIndex(index);
    };
  
    const startDate = moment(searchQueryStart).format("YYYY-MM-DD hh:mm:ss");
    const ShowStartDate = moment(searchQueryStart).format("DD/MM/YYYY");
  
// console.log(dataEditInvoice)
    return (
      <div className="flex  flex-col p-3 overflow-auto   items-center ">
        <div className="flex w-full flex-col md:flex-row gap-14 ">
          <div className="flex flex-col w-full md:w-1/2 ">
            <Typography className="text-lg lg:text-xl font-bold">
              {` แก้ไขบิล ${dataEditInvoice?.code} ${
                headFormDataStore == "1"
                  ? "(รูปแบบเต็ม)"
                  : headFormDataStore == "2"
                  ? "(รูปแบบย่อ)"
                  : headFormDataStore == "3"
                  ? "(รูปแบบสัพ)"
                  : ""
              }`}
            </Typography>
            <Typography className=" font-bold mt-14">ข้อมูลบริษัท:</Typography>
            <Typography className="  mt-5">
              {companyLoginDataStore?.company || ""}
            </Typography>
            <div className="flex gap-3">
              <Typography className="font-bold  mt-3">
                เลขประจำตัวผู้เสียภาษี:{" "}
                <span className="font-normal">
                  {companyLoginDataStore?.tax_personal || ""}
                </span>
              </Typography>
            </div>
            <div className="flex gap-3">
              <Typography className="font-bold  mt-3">
                โทร:{" "}
                <span className="font-normal">
                  {companyLoginDataStore?.tel || ""}
                </span>
              </Typography>
            </div>
            <Typography className=" font-bold mt-2">
              วันที่ออกบิล:{" "}
              <span className=" font-normal">
                {ShowStartDate}
              </span>
            </Typography>
          </div>
          <div className="flex flex-col  w-full gap-3 md:w-[60%] ">
            <div className=" flex flex-col sm:flex-row  items-center sm:items-start  w-full justify-center md:justify-end   gap-5  ">
              <div className=" justify-center">
                <Button
                  size="sm"
                  variant="gradient"
                  color="green"
                  className="text-base flex justify-center  items-center   bg-green-500"
                  disabled={openPrint == true ? true : false}
                  onClick={handleSendReceipt}
                >
                  <span className="mr-2 text-xl ">
                    <IoIosSave />
                  </span>
                  บันทึก
                </Button>
              </div>
              <div className=" justify-center">
                <Menu>
                  <MenuHandler>
                    <Button
                      size="sm"
                      variant="gradient"
                      color="blue"
                      className="text-base flex justify-center  items-center   bg-green-500"
                      disabled={openPrint == true ? false : true}
                    >
                      <span className="mr-2 text-xl ">
                        <MdLocalPrintshop />
                      </span>
                      พิมพ์
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => setOpenModalReceiptA4(true)}>
                      ขนาด A4
                    </MenuItem>
                    <MenuItem onClick={() => setOpenModalReceipt80(true)}>
                      ขนาด 80 มิล
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
              <div className=" justify-center">
                <Button
                  size="sm"
                  variant="gradient"
                  color="red"
                  className="text-base flex justify-center  items-center   bg-green-500"
                  onClick={handleout}
                >
                  <span className="mr-2 text-xl ">
                    <TbLogout2 />
                  </span>
                  ออก
                </Button>
              </div>
            </div>
  
            {/* แบบเต็ม */}
            {headFormDataStore !== "1" ? (
              <div>
                <div className="flex flex-col xl:flex-row w-full xl:gap-2 ">
                <div className="flex flex-col xl:flex-row w-full  xl:gap-5 ">
                  <div className=" flex w-full xl:w-[50%] sm:flex-row items-end  lg:justify-start   mt-5 ">
                    <div >
                      <Typography className="flex w-[50px] justify-center font-bold ps-1 xl:w-[50px] ">
                        วันที่:
                      </Typography>
                    </div>
                    <div className="z-20">
                      <DatePicker
                        // yearDropdownItemNumber={100} // จำนวนปีที่แสดงใน Dropdown
                        // yearItemNumber={100} // จำนวนปีที่แสดงในปฏิทิน
                        // showYearDropdown
                        // showMonthDropdown
                        // scrollableYearDropdown
                        // scrollableMonthDropdown
                        selected={searchQueryStart}
                        locale={th}
                        disabled={openPrint == true ? true : false}
                        dateFormat=" วันที่ dd/MM/yyyy"
                        onChange={(date) => setSearchQueryStart(date)}
                        className="w-full justify-start  rounded-md border border-gray-400 p-1 text-gray-600  shadow-sm focus:border-blue-500 focus:outline-none "
                      />
                    </div>
                  </div>
                  <div className=" flex xl:w-[50%] sm:flex-row items-end  lg:justify-start   mt-5  gap-2 ">
                    <div >
                      <Typography className="flex justify-end  items-baseline align-text-bottom font-bold min-w-[90px] ">
                        เลือกจุดขาย:
                      </Typography>
                    </div>
                    <div className="w-full" >
                      <Select
                        className="basic-single   "
                        classNamePrefix="select"
                        placeholder="เลือกจุดขาย"
                        value={selectedShop}
                        // isClearable={isClearable}
                        isDisabled={openPrint == true ? true : false}
                        isSearchable={isSearchable}
                        name="color"
                        options={shopOptions}
                        onChange={(e) => handleShopSelect(e)}
                      />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full ">
                <div className="flex flex-col xl:flex-row w-full  xl:gap-5 ">
                  <div className=" flex w-full xl:w-[50%] sm:flex-row items-end  lg:justify-start   mt-5 ">
                    <div >
                      <Typography className="flex w-[50px] justify-center font-bold ps-1 xl:w-[50px]  ">
                        วันที่:
                      </Typography>
                    </div>
                    <div className="z-20" >
                      <DatePicker
                        // yearDropdownItemNumber={100} // จำนวนปีที่แสดงใน Dropdown
                        // yearItemNumber={100} // จำนวนปีที่แสดงในปฏิทิน
                        // showYearDropdown
                        // showMonthDropdown
                        // scrollableYearDropdown
                        // scrollableMonthDropdown
                        selected={searchQueryStart}
                        locale={th}
                        disabled={openPrint == true ? true : false}
                        dateFormat=" วันที่ dd/MM/yyyy"
                        onChange={(date) => setSearchQueryStart(date)}
                        className="w-full justify-start  rounded-md border border-gray-400 p-1 text-gray-600  shadow-sm focus:border-blue-500 focus:outline-none datepicker-container  "
                      />
                    </div>
                  </div>
                  <div className=" flex xl:w-[50%] sm:flex-row items-end  lg:justify-start   mt-5  gap-2 ">
                    <div >
                      <Typography className="flex justify-end  items-baseline align-text-bottom font-bold min-w-[90px] ">
                        เลือกจุดขาย:
                      </Typography>
                    </div>
                    <div className="w-full" >
                      <Select
                        className="basic-single   "
                        classNamePrefix="select"
                        placeholder="เลือกจุดขาย"
                        value={selectedShop}
                        // isClearable={isClearable}
                        isDisabled={openPrint == true ? true : false}
                        isSearchable={isSearchable}
                        name="color"
                        options={shopOptions}
                        onChange={(e) => handleShopSelect(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className=" flex  sm:flex-row items-end  w-full xl:justify-end mt-5     gap-3 ">
                    <Typography className="flex min-w-[85px] xl:justify-end items-baseline align-text-bottom font-bold xl:min-w-[85px]">
                      ข้อมูลลูกค้า:
                    </Typography>
                    <Select
                      className="basic-single xl:w-[35%] "
                      classNamePrefix="select"
                      placeholder="เลือกลูกค้า"
                      isSearchable={isSearchable}
                      isDisabled={openPrint == true ? true : false}
                      name="color"
                      options={customerOptions}
                      onChange={(e) => handleCustomerSelect(e)}
                    />
                  </div>
                </div>
  
                <div className=" flex  w-full justify-start items-center mt-1  gap-2 ">
                  <Typography className="font-bold min-w-[30px] sm:w-[40px]">
                    ชื่อ :
                  </Typography>
                  <Typography className="w-8/12">
                    {selectedCustomer?.customer_name || ""}
                  </Typography>
                </div>
                <div className=" flex   w-full justify-start mt-2   gap-2 ">
                  <Typography className="font-bold min-w-[40px] sm:w-[45px] md:w-[55px] xl:w-[45px]">
                    ที่อยู่ :
                  </Typography>
                  <Typography>
                    {selectedCustomer?.customer_address || ""}
                  </Typography>
                </div>
                <div className=" flex flex-col sm:flex-row md:flex-col 2xl:flex-row w-full mt-2 justify-start gap-2 ">
                  <div className="flex w-full lg:w-[60%]">
                    <Typography className="font-bold min-w-[100px] md:w-[120px] xl:w-[110px]">
                      เลขประจำตัว :
                    </Typography>
                    <Typography>
                      {selectedCustomer?.customer_id_tax || ""}
                    </Typography>
                  </div>
                  <div className="flex w-full">
                    <Typography className="font-bold min-w-[110px] md:w-[120px] xl:w-[120px]">
                      เบอร์โทรศัพท์ :
                    </Typography>
                    <Typography>
                      {selectedCustomer?.customer_tel || ""}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
  
            {/* แบบสัพ */}
            <div
              className="flex-col  justify-end ms-20 mt-5  px-5 "
              hidden={headFormDataStore !== "3"}
            >
              <div className=" flex   w-full justify-end   gap-3 ">
                <Typography className="flex text-end justify-end align-text-bottom font-bold min-w-[100px]">
                  จำนวนทั้งหมด:
                </Typography>
                <Typography className="flex text-end justify-end align-text-bottom font-bold min-w-[10px]">
                  {calculateTotalUnit()}
                </Typography>
                <Typography className="font-bold text-end">ชิ้น</Typography>
              </div>
              <div className=" flex   w-full justify-end  mt-5   gap-3 ">
                <Typography className="flex text-end justify-end align-text-bottom font-bold min-w-[100px]">
                  ราคาสุทธิ:
                </Typography>
                <Typography className="flex  font-bold">
                  {calculateTotalAmount()
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Typography>
                <Typography className="flex justify-end font-bold">
                  บาท
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col xl:flex-row gap-5 ">
          <div className="flex w-full flex-col gap-3">
            <div className="flex  w-full md:w-8/8">
              <Card className="flex w-full h-[260px] mt-3 overflow-y-auto  ">
                <table className="w-full ">
                  <thead >
                    <tr>
                      {columns.map((head, index) => (
                        <th
                          key={index}
                          className=" text-left py-4   bg-gray-300 px-2 sticky top-0 z-10 "
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, index) => (
                      <tr key={index}>
                        <td
                          className={
                            headFormDataStore == "3"
                              ? "w-[7%] px-2 mt-3  ps-5 pt-3 "
                              : " w-[15%] px-2 mt-3  ps-5 pt-3"
                          }
                        >
                          {index + 1}
                        </td>
                        <td
                          className={
                            headFormDataStore == "3"
                              ? "w-[25%] pe-5"
                              : "w-[35%] pe-5"
                          }
                        >
                          <div className="mt-3">
                            <Select
                              isSearchable
                              value={selectValues[index]}
                            //   value={dataEditInvoice?.product_data?.product}
                              isDisabled={openPrint == true ? true : false}
                              onChange={(value) => handleChange(value, index)}
                              // options={selectedOptions}
                              options={productOptions}
                            />
                          </div>
                        </td>
                        <td
                          className={
                            headFormDataStore == "3"
                              ? "w-[9%] px-2 pe-5"
                              : " w-[13%] pe-10 "
                          }
                        >
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={data?.quantity}
                              disabled={openPrint == true ? true : false}
                              className="border border-gray-400 w-full py-1 mt-3 text-right "
                              onChange={(e) =>
                                handleQuantityChange(e.target.value, index)
                              }
                            />
                          </div>
                        </td>
                        <td
                          className={
                            headFormDataStore == "3"
                              ? "px-2 mt-3 pt-3 w-[7%] ps-3"
                              : "px-2 mt-3 pt-3 w-[9%] ps-3"
                          }
                        >
                          {data?.unit}
                        </td>
                        <td
                          className={
                            headFormDataStore == "3"
                              ? "px-2 mt-3 pt-3 w-[9%] ps-3 "
                              : "px-2 mt-3 pt-3 w-[13%] ps-3"
                          }
                        >
                          {" "}
                          {isNaN(data?.pricePerUnit)
                            ? "N/A"
                            : Number(data?.pricePerUnit)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className="px-2 mt-3 pt-3 w-[10%] ">
                          {isNaN(data?.totalPrice)
                            ? "N/A"
                            : Number(data?.totalPrice)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className="px-2 mt-3 pt-3 w-[5%]">
                          <button
                            className="text-3xl text-red-500"
                            disabled={openPrint == true ? true : false}
                            // onClick={() => deleteRow(row.id)}
                            onClick={() => handleDeleteRow(index)}
                          >
                            <MdRemoveCircle />
                          </button>
                        </td>
                        {headFormDataStore == "3" ? (
                          <>
                            <td className="w-[13%] px-2 pe-14 ">
                              <div>
                                <input
                                  type="number"
                                  min="0"
                                  value={data?.amountBill}
                                  disabled={openPrint == true ? true : false}
                                  className="border border-gray-400 w-full py-1 mt-3 text-right "
                                  onChange={(e) =>
                                    handleBillChange(e.target.value, index)
                                  }
                                />
                              </div>
                            </td>
                            <td className="w-[15%] px-2 ">
                              <div className=" justify-center">
                                <Menu>
                                  <MenuHandler>
                                    <Button
                                      size="sm"
                                      variant="gradient"
                                      color="blue"
                                      className="text-base flex justify-center  items-center   bg-green-500"
                                      disabled={openPrint == true ? false : true}
                                    >
                                      <span className="mr-2 text-xl ">
                                        <MdLocalPrintshop />
                                      </span>
                                      พิมพ์สัพ
                                    </Button>
                                  </MenuHandler>
                                  <MenuList>
                                    <MenuItem
                                      onClick={() =>
                                        handleModalReceiptSubFull(index)
                                      }
                                    >
                                      ขนาด A4
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        handleModalReceiptSubShort(index)
                                      }
                                    >
                                      ขนาด 80 มิล
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </div>
                            </td>
                          </>
                        ) : (
                          ""
                        )}
                      </tr>
                    ))}
  
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <Button
                            size="sm"
                            variant="gradient"
                            color="green"
                            disabled={openPrint == true ? true : false}
                            className="text-base flex justify-center  items-center mt-5 ms-16  bg-green-500"
                            // onClick={addRow}
                            onClick={handleAddRow}
                          >
                            <span className="mr-2 text-xl ">
                              <BsPlusCircle />
                            </span>
                            เพิ่มแถว
                          </Button>
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
            <div>
              <Input
                className="flex w-full px-2   "
                maxLength="100"
                label="หมายเหตุ"
                type="text"
                disabled={openPrint == true ? true : false}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          {headFormDataStore !== "3" ? (
            <div
              hidden={headFormDataStore !== "1"}
              className="flex  w-full xl:w-1/3 mt-5  "
            >
              <Card className="w-full justify-center border p-2 px-4   xl:h-[170px] 2xl:h-[120px] lg:justify-normal border-gray-500">
                <Typography className="font-bold">
                  รวมเงิน:{" "}
                  <span className="font-normal">
                    {calculatePruePrice()
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>{" "}
                  บาท{" "}
                </Typography>
  
                <Typography className="font-bold">
                  ภาษีมูลค่าเพิ่ม:{" "}
                  <span className="font-normal">
                    {calculateVAT()
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>{" "}
                  บาท{" "}
                </Typography>
                <Typography className="font-bold">
                  จำนวนเงินทั้งสิน:{" "}
                  <span className="font-normal">
                    {calculateTotalAmount()
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>{" "}
                  บาท{" "}
                </Typography>
              </Card>
            </div>
          ) : (
            ""
          )}
        </div>
  
        {/* รูปแบบเต็ม A4 */}
  
        {openModalReceiptA4 == true && headFormDataStore == "1" ? (
          <>
            <ReceiptA4
              openModalReceiptA4={openModalReceiptA4}
              handleModalReceiptA4={handleModalReceiptA4}
              dataReceipt={dataReceipt}
              customer={selectedCustomer}
              companyLoginDataStore={companyLoginDataStore}
              selectedShop={selectedShop}
            />
          </>
        ) : (
          ""
        )}
  
        {/* รูปแบบเต็ม 80 */}
        {openModalReceipt80 == true && headFormDataStore == "1" ? (
          <Receipt80
            openModalReceipt80={openModalReceipt80}
            handleModalReceipt80={handleModalReceipt80}
            dataReceipt={dataReceipt}
            companyLoginDataStore={companyLoginDataStore}
            selectedShop={selectedShop}
          />
        ) : (
          ""
        )}
  
        {/* รูปแบบย่อ A4 */}
        {(openModalReceiptA4 == true && headFormDataStore == "2") ||
        headFormDataStore == "3" ? (
          <ReceiptA4Short
            openModalReceiptA4={openModalReceiptA4}
            handleModalReceiptA4={handleModalReceiptA4}
            dataReceipt={dataReceipt}
            companyLoginDataStore={companyLoginDataStore}
            selectedShop={selectedShop}
          />
        ) : (
          ""
        )}
  
        {/* รูปแบบย่อ 80 */}
        {(openModalReceipt80 == true && headFormDataStore == "2") ||
        headFormDataStore == "3" ? (
          <Receipt80Short
            openModalReceipt80={openModalReceipt80}
            handleModalReceipt80={handleModalReceipt80}
            dataReceipt={dataReceipt || []}
            companyLoginDataStore={companyLoginDataStore}
            selectedShop={selectedShop}
          />
        ) : (
          ""
        )}
  
        {/* รูปแบบสัพ A4 */}
        {headFormDataStore == "3" ? (
          <ReceiptSubFull
            openModalReceiptSubFull={openModalReceiptSubFull}
            handleModalReceiptSubFull={handleModalReceiptSubFull}
            dataReceipt={dataViewSub?.sec_product_data?.[printIndex + 1]}
            dataView={dataReceipt}
            companyLoginDataStore={companyLoginDataStore}
            selectedShop={selectedShop}
          />
        ) : (
          ""
        )}
  
        {/* รูปแบบสัพ 80 */}
        {(openModalReceiptSubShort == true && headFormDataStore == "3") ||
        headFormDataStore == "3" ? (
          <ReceiptSubShort
            openModalReceiptSubShort={openModalReceiptSubShort}
            handleModalReceiptSubShort={handleModalReceiptSubShort}
            dataReceipt={dataViewSub?.sec_product_data?.[printIndex + 1]}
            dataView={dataReceipt}
            companyLoginDataStore={companyLoginDataStore}
            selectedShop={selectedShop}
          />
        ) : (
          ""
        )}
  
        <ToastContainer className="mt-10" autoClose={1000} theme="colored" />
      </div>
    );
  };
  
  export default EditInvoice;
  