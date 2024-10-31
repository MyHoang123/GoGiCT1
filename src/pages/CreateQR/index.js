import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'

import QRCode from 'qrcode.react';
import './CreateQr.scss'
function App() {
    const [url, setUrl] = useState('');
    const [urlType, setUrlType] = useState('');
    const [urlTable, setUrlTable] = useState('');
    const [types, setTypes] = useState([])
    const [tables, setTables] = useState([])
    const qrContent = useRef()
    useEffect(() => {
      axios.all([
        axios.get('http://localhost:8080/api/v12/showtype'),
        axios.get('http://localhost:8080/api/v12/showtableqr'),
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
        const urln = `${process.env.REACT_APP_IP_CLIENT}/order/buffe/${urlType}?table=${urlTable}`
        setUrl(urln)
        qrContent.current.classList.add('open')
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
            (type.Name === '' ? null : (
              <option value={type.Id} key={i}>{type.Name}</option>
            ))
          ))}
              <option value='All'>Gọi Món</option>
        </select>
        <select onChange={e => setUrlTable(e.target.value)} className='createqr_content-table'>
          <option>Chọn Bàn</option>
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