import axios from 'axios'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getShortInvoice = async (searchQuery , selectedShop) => {
  // console.log(searchQuery)
    try {
        let Token = localStorage.getItem("Token");
    const response = await axios.get(
      `${ 
        import.meta.env.VITE_APP_API
      }/inovicesh/invoices-sh-search?search=${searchQuery}&salepoints=${Number(selectedShop) || ''}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    // console.log(response.data)
    return response.data;

        
    } catch (error) {
        console.error(error)
        
    }
}

export const addShortInvioce = async (data , setOpenPrint) => {
  try {
    let Token = localStorage.getItem("Token");
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}/inovices/addinovices-sh`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    toast.success("สร้าง ใบกำกับภาษี(รูปแบบย่อย) สำเร็จ")
    setOpenPrint(true)
    return response.data.data;
  } catch (error) {
    toast.error("ไม่สามารถสร้าง ใบกำกับภาษี(รูปแบบย่อย) กรุณาลองอีกครั้ง ")
  }
};


export const editShortInvioce = async (data , setOpenPrint) => {
  try {
    let Token = localStorage.getItem("Token");
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}/inovicesh/editinvoicesh`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    toast.success("สร้าง ใบกำกับภาษี(รูปแบบย่อย) สำเร็จ")
    setOpenPrint(true)
    return response.data.data;
  } catch (error) {
    toast.error("ไม่สามารถสร้าง ใบกำกับภาษี(รูปแบบย่อย) กรุณาลองอีกครั้ง ")
  }
};

export const deleteShortInvoice = async (id , setToastOpen) => {
  try {
    let Token = localStorage.getItem("Token");
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API}/inoviceshinovices-sh/delete/${id}`,
      
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    toast.success('ลบใบกำกับภาษี(รูปแบบย่อย) สำเร็จ')
    setToastOpen(true)
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
