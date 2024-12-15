import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import QRCode from 'qrcode.react';
import './CreateQr.scss'
import { Type } from 'react-feather';
function App() {
  const cookies = new Cookies
    const [url, setUrl] = useState('');
    const [urlType, setUrlType] = useState('');
    const [urlTable, setUrlTable] = useState('');
    const [types, setTypes] = useState([])
    const [tables, setTables] = useState([])
    const qrContent = useRef()
    async function createQR(IdTable,IdType) {
      try {
         const response = await axios.post('https://severgogi.onrender.com/api/v12/createqr', {IdTable:IdTable,IdType: IdType,token:cookies.get('AccessTokenAdmin')})
         if(response.data.massege === 'Thanh cong') {
            const urln = `${process.env.REACT_APP_IP_CLIENT}/order?token=${response.data.token}`
            setUrl(urln)
            qrContent.current.classList.add('open')
          }
      } catch (error) {
          alert('Có lõi xảy ra vui lòng thử lại')
      }
  }
    useEffect(() => {
      axios.all([
        axios.get('https://severgogi.onrender.com/api/v12/showtype'),
        axios.get('https://severgogi.onrender.com/api/v12/showtableqr'),
      ])
        .then(axios.spread((Type,Table,) => {
          setTypes(Type.data.data)
          setTables(Table.data.data)
        }))
        .catch (err => {
            console.error()
        })
    },[]) 
    const handleClickCreateQR = () => {
      if(urlType !== null) {
        createQR(urlTable,urlType)
      }
      else {
        return null
      }
      };
    return ( 
        <>
    <div className='createqr_container'>
      <h1>QR Code Generator</h1>
      <div className='createqr_content'>
        <select className='createqr_content-type' onChange={e => setUrlType(e.target.value)}>
          <option>Chọn Gói</option>
          {types.map((type,i) => (
            (type.Name === '' ? 
              (
                <option value={type.Id} key={i}>Gọi món</option>
              ) : (
              <option value={type.Id} key={i}>{type.Name}</option>
            ))
          ))}
        </select>
        <select onChange={e => setUrlTable(e.target.value)} className='createqr_content-table'>
          {tables.map((table,i) => (
            <option value={table.Id} key={i}>{table.Name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleClickCreateQR} className='button_createqr'>Tạo QR</button>
      <div ref={qrContent} className='Qr_content'style={{ marginTop: '20px' }}>
        <QRCode value={url} size={256} />
      </div>
    </div>
        </>
     );
}

export default App;