import React, { useState,useEffect, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import {ElementContextAdmin} from '../../components/Layout/AdminLayout'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectIntersection } from '@dnd-kit/sortable';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';

import './Open.scss'

function DragAndDropExample() {
  const [checkEdit, setCheckEdit] = useState(false)
  const [products, setProducts] = useState([])
  const [dropZoneItems, setDropZoneItems] = useState([])
  const [categoris, setCategoris] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [status,setStatus] = useState(false)
  const {cookies} = useContext(ElementContextAdmin)

 // Gửi dữ liệu lên API
 async function updataVisible(product) {
  try {
    const response =  await axios.put('https://severgogi.onrender.com/api/v12/updatevisible', product);
    if(response.data.massege === "Thanh cong") {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
        alert('Co lõi xảy ra')
    }
  } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      // Xử lý lỗi tại đây.
  }
}
  const handleDragStart = (event) => {
    if(products.find((item) => item.Id === event.active.id) !== undefined) {
      setActiveItem(() => products.find((item) => item.Id === event.active.id));
    }
    else {
      setActiveItem(() => dropZoneItems.find((item) => item.Id === event.active.id));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === 'dropZon1') {
      setDropZoneItems((items) => [...items, products.find((item) => item.Id === active.id)]);
      setProducts(() => products.filter((item) => item.Id !== active.id));
    }
    else if(over && over.id === 'dropZone') {
      setProducts((items) => [...items, dropZoneItems.find((item) => item.Id === active.id)]);
      setDropZoneItems(() => dropZoneItems.filter((item) => item.Id !== active.id));
    }
    else if (over && over.id !== 'dropZone' && over.id !== 'dropZon1') {
      const overIndex = products.indexOf(over.id);
      const activeIndex = products.indexOf(active.id);

      if (activeIndex !== overIndex) {
        setProducts((items) =>
          arrayMove(items, activeIndex, overIndex)
        );
      }
    } else {
      // Nếu item được kéo ra khỏi vùng drop zone
      const dropZoneItemIndex = dropZoneItems.findIndex((item) => item === active.id);
      if (dropZoneItemIndex !== -1) {
        setDropZoneItems((items) =>
          items.filter((_, index) => index !== dropZoneItemIndex)
        );
        setProducts((items) => [...items, active.id]);
      }
    }
    setActiveItem(null);
  }
  const handleClickEdit = async (e) => {
    if(e.target.checked) {
      try {
        const response = await axios.post('https://severgogi.onrender.com/api/v12/onOpen',{status: 1, token: cookies.get('AccessTokenAdmin')});
        if(response.data.massege === "Thanh cong") {
          setStatus(true)
        }
        else {
          setStatus(false)
        }
    } catch (error) {
        alert('Có lõi xảy ra vui lòng thử lại')
    }
    }
    else {
      try {
        const response = await axios.post('https://severgogi.onrender.com/api/v12/onOpen',{status: 0, token: cookies.get('AccessTokenAdmin')});
        if(response.data.massege === "Thanh cong") {
          setStatus(false)
        }
        else {
          setStatus(true)
        }
    } catch (error) {
        alert('Có lõi xảy ra vui lòng thử lại')
    }
    }
  }
  const handleClickFilterCate = (id) => {
    const result = products.reduce((acc, curr) => {
        if(curr.IdCategoris !== id) {
          const newarr = {...curr}
          newarr.Status = 'hiden'
          return [...acc,newarr]
        }
        else {
          const newarr = curr
          newarr.Status = 'visible'
          return [...acc,newarr]
        }
    }, []);
    setProducts(result)
  }
  const handleClickFilterCateDropZon = (id) => {
    const result = dropZoneItems.reduce((acc, curr) => {
        if(curr.IdCategoris !== id) {
          const newarr = {...curr}
          newarr.Status = 'hiden'
          return [...acc,newarr]
        }
        else {
          const newarr = curr
          newarr.Status = 'visible'
          return [...acc,newarr]
        }
    }, []);
    setDropZoneItems(result)
  }
  const handleClickSaveProduct = () => {
      if(dropZoneItems.length > 0) {
        const resultV = dropZoneItems.reduce((acc,curr) => {
          return [...acc,curr.Id]
        },[])
        const resultH = products.reduce((acc,curr) => {
          return [...acc,curr.Id]
        },[])
        const productsn = {
          IdProductH: resultH,
          IdProductV: resultV,
        }
        updataVisible(productsn)
      }
  }
  useEffect(() => {
    axios.all([
      axios.get('https://severgogi.onrender.com/api/v12/showproductadmin'),
      axios.get('https://severgogi.onrender.com/api/v12/showcategori'),
    ])
      .then(axios.spread((product,categori) => {
        const dropItem = []
        const dropZone = []
        for(let i in product.data.data){
          if(product.data.data[i].Visible === 1) {
            dropZone.push(product.data.data[i])
          }
          else {
            dropItem.push(product.data.data[i])
          }
        }
        setProducts(dropItem)
        setDropZoneItems(dropZone)
        setCategoris(categori.data.data)
      }))
      .catch (err => {
          console.error()
      })
  }, [])
  useEffect(() => {
    axios.all([
        axios.post('https://severgogi.onrender.com/api/v12/checkstatus',{
            token: cookies.get('AccessTokenAdmin')
        }),
    ])
        .then(axios.spread((checkStatus) => {
            if(checkStatus.data.massege === 'Thanh cong') {
              setStatus(true)
            }
            else {
              setStatus(false)
            }
        }))
        .catch (err => {
            console.error()
        })
},[])
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className='Open_checkin_container'>
        <div className='Open_checkin_container-item'>
          <div className='Title_checkin'>
              <span>Check-In:</span>
          </div>
          <div className='button_edit-slider'>
            <label className="switch">
              <input checked={status} onChange={e => handleClickEdit(e)} type="checkbox" className="input"/>
              <span className="slider_checkedit"></span>
            </label>
          </div>
          <div className='btn_checkin-status'>
            {/* <span>{checkEdit ? ('Bật') : ('Tắt')}</span> */}
          </div>
        </div>
      </div>
      <div className='Open_container-header'>
          <div className='Open-container-header-item'>
              <h1>Sản phẩm</h1>
              <div className='Open-container_categorilist'>
                <div className="radio-inputs">
                  {categoris.map((cate,i) => (
                    <label key={i} className="radio">
                      <input onClick={() => handleClickFilterCate(cate.Id)} type="radio" name="radio"/>
                      <span className="name">{cate.Name}</span>
                    </label>
                  ))}
                </div>
              </div>
          </div>
          <div className='Open-container-header-item'>
              <h1>Trưng bày</h1>
              <div className='Open-container_categorilist'>
                <div className="radio-inputs">
                {categoris.map((cate,i) => (
                    <label key={i} className="radio">
                      <input onClick={() => handleClickFilterCateDropZon(cate.Id)} type="radio" name="radio"/>
                      <span className="name">{cate.Name}</span>
                    </label>
                  ))}
                </div>
              </div>
          </div>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
          <div className='Dropzone_Product_List'>
            <DropZone id="dropZone">
                <div  className='Dropzone_listItem'>
                {products.map((product,index) => (
                (product.Status === 'visible' ? (
                 <div key={index} className='Dropzone_listItem-content'>
                <DraggableItem id={product.Id}>
                    {product}
                </DraggableItem>
                </div>
              ) : (null))
                ))}
                </div>
            </DropZone>
          </div>
        <div className='Dropzone_Product_List'>
        <DropZone id="dropZon1">
            <div className='Dropzone_listItem'>
          {dropZoneItems.map((product,index) => (
         (product.Status === 'visible' ? (
          <div key={index} className='Dropzone_listItem-content'>
         <DraggableItem id={product.Id}>
             {product}
         </DraggableItem>
         </div>
        ) : (null))
           ))}
            </div>
        </DropZone>
          </div>
      </div>
      <DragOverlay style={{zIndex:'100'}}>
        {activeItem ? (
          <DraggableItem id={activeItem.Id}>
            {activeItem}
          </DraggableItem>
        ) : null}
      </DragOverlay>
        <div className='Open_btn_save'>
            <div className='Open_btn_save-item'>
                  <button onClick={handleClickSaveProduct}>
                    <div className="svg-wrapper-1">
                      <div className="svg-wrapper">
                          <FontAwesomeIcon icon={faFloppyDisk} />
                      </div>
                    </div>
                    <span>Save</span>
                </button>
            </div>
        </div>
    </DndContext>
  );
}

export default DragAndDropExample;