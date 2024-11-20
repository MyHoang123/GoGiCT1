import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarHalfStroke,faStar } from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; 
function useRenderStar({ Star }) {
    return (
        <>
        {(Star > 4.8 ? (
            <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
            </div>
            ): 
            (Star > 4.3 && Star <= 4.8 ? (
            <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarHalfStroke} />
            </div>
            ) : 
            (Star >=4 && Star <= 4.3 ? (
            <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
            </div>
            ) : 
            (Star >= 3.5 && Star < 4 ? (
            <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarHalfStroke} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
            </div>
            ) : 
            (Star >= 3 && Star < 3.5 ? (
            <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
            </div>
            ) : 
            (Star >= 2 ? (
                <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
            </div>
            ) : 
            (Star >= 1 ? (
                <div className='four-star-svg'>
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStar} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
                <FontAwesomeIcon style={{color: '#fc0'}} icon={faStarRegular} />
            </div>
            ) : 
            (
            <div className='four-star-svg'>
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
            </div>
            )
        )
        )
        )
        )
        )
        )
            )}                                                                     
        </>
     );
}

export default useRenderStar;