import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { memo } from 'react'

function StatusBill({ cx, Status }) {
    switch (Status) {
        case 0:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw', color: 'rgb(255 203 94)' }} icon={faTruckFast} />
                    <span style={{ color: ' rgb(255 203 94)' }}>Chờ quán xác nhận</span>
                </div>
            )
        case 1:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw' }} icon={faTruckFast} />
                    <span>Chờ giao hàng</span>
                </div>
            )
        case 2:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw' }} icon={faTruckFast} />
                    <span>Đang giao hàng</span>
                </div>
            )
        case 3:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw' }} icon={faTruckFast} />
                    <span>Hoàng thành</span>
                </div>
            )
        case 4:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw' }} icon={faTruckFast} />
                    <span>Đã đánh giá</span>
                </div>
            )
        default:
            return (
                <div className={cx('Purchase_content_body_container_header-item_status')}>
                    <FontAwesomeIcon style={{marginRight: '.4vw',color:'rgb(188 0 0)' }} icon={faTruckFast} />
                    <span style={{color:'rgb(188 0 0)'}}>Đã hủy</span>
                </div>
            )
    }
}

export default memo(StatusBill);