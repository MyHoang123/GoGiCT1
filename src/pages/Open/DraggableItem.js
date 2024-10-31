
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar } from '@fortawesome/free-solid-svg-icons';
import './Open.scss'

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    height: '100%',
    border: '1px solid #ccc',
    cursor: 'grab',
  };
  return (
      <>
      <div className='Open_Item_Product'>
            <div className="card"  ref={setNodeRef} style={style} {...attributes} {...listeners}>
              <div className='start_product-open'>
                <span><FontAwesomeIcon style={{width:'14px',color:'rgb(255, 204, 0)'}} icon={faStar} /></span>
                <span style={{color:'#333'}}>{children.Star}</span>
              </div>
                <div className="card-img">
                    <img src={`http://localhost:8080/api/v12/showimgproduct/${children.Img}`}/>
                </div>
                <div className="card-info">
                  <p style={{height:'40px'}} className="text-title">{children.Name}</p>
                  <div className="text-body">Salad & Khai vị</div>
                </div>
                <div className="card-footer">
                <span className="text-title">{children.Price}</span>
                <div className="card-button">
                </div>
              </div>
          </div>
        </div>
      </>
  );
}
export default DraggableItem