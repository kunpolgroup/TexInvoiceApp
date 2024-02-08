/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
  } from "@react-pdf/renderer";
  
  import "../../App.css";
  
  import { PDFViewer } from "@react-pdf/renderer";
  import THBText from "thai-baht-text";
  
  import moment  from "moment";
  
  import FontSarabun from "./font/Sarabun-Regular.ttf";
  import FontSarabunBold from "./font/Sarabun-ExtraBold.ttf";
  import FontSarabunLight from "./font/Sarabun-ExtraBold.ttf";
  import Prompt from "./font/Prompt-Regular.ttf";
  import Mitr from "./font/Mitr-Regular.ttf";
  // import { useState, useEffect } from "react";
  import {
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Button,
  } from "@material-tailwind/react";
  
  import PropTypes from "prop-types";
  
  
  Font.register({
    family: "Sarabun",
    src: FontSarabun,
  });
  Font.register({
    family: "SarabunBold",
    src: FontSarabunBold,
  });
  Font.register({
    family: "SarabunLight",
    src: FontSarabunLight,
  });
  Font.register({
    family: "Prompt",
    src: Prompt,
  });
  Font.register({
    family: "Mitr",
    src: Mitr,
  });
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      // backgroundColor: "ffff",
      padding: 20,
      margin: 1,
      fontFamily: "SarabunLight",
    },
    header1: {
      fontSize: 28,
      textAlign: "center",
      marginBottom: 20,
      marginTop: 100,
    },
    header: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 20,
    },
    body: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
    },
    footer: {
      fontSize: 12,
      color:'#ccc',
      textAlign: "center",
      marginBottom: 10,
      position:'absolute',
      bottom:'0',
      left:'0',
      right:'0',
      height:'20px'
      
    },
    signature: {
      fontSize: 12,
      textAlign: "left",
    },
    flexrow: {
      display: "flex",
      flexDirection: "row",
    },
    flexrowbetween: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      wordBreak: "break-word",
    },
    flexrowaround: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      wordBreak: "break-word",
    },
    flexrowcenter: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      textAlign: "center",
    },
    flexrowend: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      textAlign: "right",
    },
    flexrowstart: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      textAlign: "left",
    },
    text6: {
      fontSize: 12,
    },
    text8: {
      fontSize: 12,
    },
    text12: {
      fontSize: 12,
    },
    text14: {
      fontSize: 14,
    },
    text16: {
      fontSize: 16,
    },
    text16b: {
      fontSize: 16,
      fontWeight: "bold",
    },
    text18: {
      fontSize: 18,
    },
    textxl: {
      fontSize: 24,
      fontFamily: "SarabunBold",
      fontWeight: "bold",
    },
    spacesm: {
      marginRight: 5,
    },
    spacemd: {
      marginRight: 20,
    },
    fontbase: {
      fontSize: 14,
      fontWeight: "normal",
      fontFamily: "SarabunLight",
    },
    fontbold: {
      fontSize: 18,
      fontWeight: "bold",
    },
  
    borderb: {
      borderBottom: 2,
      paddingBottom: 10,
    },
  
    imageContainer: {
      alignSelf: "center",
      marginTop: 20,
      marginBottom: 20,
      wordBreak: "break-word",
    },
    image: {
      width: 70,
      height: 70,
    },
    image1: {
      width: 90,
      height: 90,
    },
    mt5: {
      marginTop: 5,
      wordBreak: "break-word",
    },
    mt10: {
      marginTop: 10,
      wordBreak: "break-word",
    },
    mtsm20: {
      marginTop: 20,
      wordBreak: "break-word",
    },
    mt25: {
      marginTop: 25,
      wordBreak: "break-word",
    },
    mt30: {
      marginTop: 30,
      wordBreak: "break-word",
    },
    mtmd: {
      marginTop: 30,
    },
    underlineText: {
      textDecoration: "underline",
      textDecorationStyle: "dot",
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 10,
    },
    colorHead: {
      backgroundColor: "#D9D9D9",
    },
    tableRow: {
      margin: "auto",
      display:'flex',
      flexDirection: "row",
      alignItems:'center',
    },
    tableCellHead1: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellHead2: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "55%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellHead3: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellHead4: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCell1: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCell2: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "55%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "auto",
    },
    tableCell3: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCell4: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCell5: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "15%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCell6: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: "#000",
      textAlign: 'center',
      width: "5%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellRowsum: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderTopWidth: 1,
      borderColor: "#000",
      textAlign: "center",
      width: "70%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellNote: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      textAlign: "center",
      borderWidth: 1,
      borderTopWidth: 1,
      borderTop:'1',
      borderLeft:'1',
      borderRight:'1',
      borderBottom:'0',
      borderColor: "#000",
      width: "70%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
    tableCellNoteBorder: {
      margin: "auto",
      fontSize: 10,
      padding: 5,
      borderWidth: 1,
      borderTopWidth: 1,
      borderTop:'0',
      borderColor: "#000",
      width: "70%", // แบ่งเป็น 3 ส่วนเท่า ๆ กัน (ขนาดเท่ากัน)
      height: "100%",
    },
  
  
  });
  
  export const ReceiptSubFull = ({
    openModalReceiptSubFull,
    handleModalReceiptSubFull,
    dataReceipt,
    companyLoginDataStore,
    dataView,
    selectedShop
  
  }) => {

    // console.log(dataReceipt)
    // console.log(companyLoginDataStore)
    // console.log(dataView)
    // console.log(selectedShop?.salepoints_name)
  

  
    const itemsPerPage = 1; // จำนวนรายการต่อหน้า
  
    // แบ่งรายการออกเป็นหน้าตามจำนวนที่กำหนด
  
    const generatePages = (data) => {
      const totalPages = Math.ceil(data?.length / itemsPerPage);
      const pages = [];
  
      for (let i = 0; i < totalPages; i++) {
        const start = i * itemsPerPage;
        const end = start + itemsPerPage;
        const slicedData = data.slice(start, end).map((item, index) => ({
          ...item,
          index: start + index + 1, // เพิ่ม property index เพื่อเก็บลำดับ
        }));
        pages.push(slicedData);
      }
  
      return pages;
    };
  
    const pages = generatePages(dataReceipt);


  
  
    //  แปลงเวลา
     const formattedDateTime = moment(dataView?.created_at).format("DD/MM/YYYY ");
  
  
    return (
      <Dialog open={openModalReceiptSubFull} handler={handleModalReceiptSubFull} size="xl">
        {/* <DialogHeader></DialogHeader> */}
        <DialogBody>
          {/* <Page size={[842, 595]} style={styles.page}> */}
          {/*  9 x 11 นิ้ว (792 คือ 9 นิ้ว x 72 คือ DPI, 936 คือ 11 นิ้ว x 72 คือ DPI) */}
          <PDFViewer width="100%" height="650px">
            <Document>
              {pages?.map((pageData, index) =>  (
                <Page key={index} size="A4" style={styles.page} > 
                <View style={[styles.flexrowbetween, styles.text12]}>
                  <Text style={[ {color:"#fff"}]}>.</Text>
                  <Text>เลขที่:  {dataReceipt[index]?.invoice_number}  {''} </Text>
                </View>
                <View style={[styles.flexrowcenter, styles.mtsm20]}>
                  <Text style={[styles.flexrowcenter, styles.text18]}>
                    ใบเสร็จรับเงิน / ใบกำกับภาษีอย่างย่อ '
                  </Text>
                </View>
                <View style={[styles.flexrowcenter, styles.text14 , styles.mt10]}>
                <Text >
                    วันที่  {formattedDateTime} {''}
                </Text>
                </View>
                  <View>
                 
                    <Text style={[styles.flexrowcenter, styles.text14 , styles.mt10]}>
                    {companyLoginDataStore?.company}  {''}
                    </Text>
                    <Text
                      style={[styles.flexrowcenter, styles.text12, styles.mt10]}
                    >
                      {companyLoginDataStore?.address}  {''} 
                    </Text>
                    <Text
                      style={[
                        styles.flexrowcenter,
                        styles.text12,
                        styles.mt10,
                        // styles.borderb,
                      ]}
                    >
                      เลขประจำตัวผู้เสียภาษี: {companyLoginDataStore?.tax_personal}  {''} โทรศัพท์: {companyLoginDataStore?.tel }    {''}
                    </Text>
                  </View>
                  <View>
                  
                  </View>
                  <View>
                    <Text style={[styles.flexrowcenter, styles.text6, styles.mt10 ]}>
                    จุดขาย: {dataView?.salepoints_name?.length > 1  ? dataView?.salepoints_name  : selectedShop?.salepoints_name }  {''}
                    </Text>
                  </View>
                  <View>
      
                    {/*-----------  หัวตาราง ---------------------  */}
                    <View style={[styles.table, { marginTop: "10" }]}>
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCellHead1, styles.colorHead]}>
                          จำนวน    {''}
                        </Text>
                        <Text style={[styles.tableCellHead2, styles.colorHead]}>
                          รายการ   {''}
                        </Text>
                        <Text style={[styles.tableCellHead3, styles.colorHead]}>
                          ราคา/หน่วย   {''}
                        </Text>
                        <Text style={[styles.tableCellHead4, styles.colorHead]}>
                          ราคา   {''}
                        </Text>
                      </View>
                      {pageData?.map((item, itemIndex) => {
                        return (
                          <>
                          <View key={itemIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell1}>
                              {item?.products_quantity  || ""}  {''}
                            </Text>
                            <Text style={[styles.tableCell2 , {textAlign: "left"}]}>
                              {" "}
                              {` ${item?.product_name}   `}  {''}
                            </Text>
                            <Text style={styles.tableCell3}>
                              {" "}
                              {Number(item?.pricePerUnit).toFixed(2)
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}  {''}
                            </Text>
                            <Text style={styles.tableCell4}>
                              {" "}
                              {Number(item?.price_per_invoice).toFixed(2)
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}  {''}
                            </Text>
                          </View>
                          <View  style={styles.tableRow}>
                       
                       <Text style={[styles.tableCellNote , {paddingTop:"10"}  ]}>
                         {THBText(Number(item?.price_per_invoice).toFixed(2)) || ''}  {''}
                       </Text>
                       <Text style={[styles.tableCell4 ,{paddingTop:"10"}]}> รวมเงิน </Text>
                       <Text style={[styles.tableCell5 ,{paddingTop:"10"}, {alignContent:"center"}]}>
                       {Number(item?.price_per_invoice).toFixed(2)
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}  {''}
                       </Text>
                     </View>
                  
                          </>  
                        );
                      })}
                    </View>
                    <View style={[styles.flexrow]}>
                          <Text style={[styles.text12 , styles.mt10]} >หมายเหตุ: </Text>
                          <Text style={[styles.text12 , styles.mt10 ]} >{dataView?.note || ''}  {''} </Text>
                        </View>
                    {/*   ลงชื่อผู้รับ/ผู้จ่าย  */}
                        <View style={[styles.flexrow, styles.mtsm20]}>
                          <View>
                            <Text
                              style={[
                                { fontWeight: "extrabold" },
                                { fontFamily: "SarabunBold" },
                                { fontSize: "11" },
                                styles.mtsm,
                                styles.spacesm,
                              ]}
                            >
                              ผู้รับเงิน: ..............................................
                            </Text>
                          </View>
                        </View>
                  </View>
                </Page>
              
              ))}
            </Document>
          </PDFViewer>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            size="sm"
            onClick={() => handleModalReceiptSubFull()}
            className="mr-1"
          >
            <span className="text-sm">ยกเลิก</span>
          </Button>
        </DialogFooter>
      </Dialog>
    );
  };
  
  ReceiptSubFull.propTypes = {
    openModalReceiptSubFull: PropTypes.bool.isRequired,
    handleModalReceiptSubFull: PropTypes.func.isRequired,
  };
  
  export default ReceiptSubFull;
  