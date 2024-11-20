import { useState, createContext, useRef, useEffect, useCallback } from "react";
import io from 'socket.io-client';
import { Cookies } from 'react-cookie'

const IdElementContext = createContext()
function IdElementProvider( {children} ) {
    const cookies = new Cookies()
    // State global defaultlayout
    const [IdProduct,setIdProduct] = useState('id_product')
    const [modelProfile,setModelProfile] = useState(false)
    const [socket, setSocket] = useState(null)
    const [checkUser, setCheckUser] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [checkAutoNext, setCheckAutoNext] = useState(0)
    const [Amount,setAmount] = useState(0)
    const [modelLogin,setModelLogin] = useState(false)
    const [indexSlide, setIndexSlide] = useState([0,1,2,3,4,5])
    // const [playSlideMini, setPlaySlideMini] = useState(false)
    let autoNext = useRef()
    const navbar = useRef()
    const videoBest = useRef()
    const btn = useRef()
    const titleHeaderBody = useRef()
    const headerBodyContent = useRef()
    const sliderNew = useRef([])
    const bestSellerItem = useRef([])
    const itemHeaderBody = useRef([])
    const openLid = useRef([])
    const youtubeRef = useRef([])
    const imgProductSlide = useRef([])
    const bodyNhansu = useRef()
    const gogiBackround = useRef()
    const sloganProduct = useRef()
    const modalVideoBest = useRef()
    const cartProduct = useRef()
    const modelBody = useRef([])
    const imgBestSeller = useRef([])
    const listProductBest = useRef([])
    const desProduct = useRef([])
    // Ref global defaultlayout
    const handleClickDarkMode = (e) => {
        if(e.target.checked === true) {
            setDarkMode(true)
        }
        else {
            setDarkMode(false)
        }
    }

    const handleClickOpenLogin = useCallback(() => {
        modelBody.current[1].style.display = 'none'
        modelBody.current[0].style.display = 'block'
        setModelLogin(true)
        },[])
    const delayTimoutBlock = (i) => {
        const timout = setTimeout(() => {
            openLid.current[i].style.display = 'none'
        },5000)
        return () => {
            clearTimeout(timout)
        }
    }
    const data = {
        listProductBest,
        videoBest,
        modalVideoBest,
        imgBestSeller,
        socket,
        setSocket,
        handleClickOpenLogin,
        modelBody,
        setModelLogin,
        modelLogin,
        setAmount,
        Amount,
        sloganProduct,
        checkAutoNext,
        autoNext,
        setIndexSlide,
        indexSlide,
        gogiBackround,
        imgProductSlide,
        desProduct,
        youtubeRef,
        bodyNhansu,
        openLid,
        bestSellerItem,
        IdProduct,
        modelProfile,
        setModelProfile,
        checkUser,
        setCheckUser,
        darkMode,
        setDarkMode,
        handleClickDarkMode,
        btn,
        navbar,
        titleHeaderBody,
        cartProduct,
        headerBodyContent,
        itemHeaderBody,
        sliderNew,
    }
    useEffect(() => {
        const imgLogan = require(`../../../Asset/images/${indexSlide[0]}.png`)
        const handleScroll = () => {
        //     if (navbar.current) {
                const top = Math.abs(btn.current.getBoundingClientRect().top)
            if(top < 620 && top > 1) {
                clearInterval(autoNext.current)
                btn.current.style.pointerEvents = 'none'
                sloganProduct.current.src = imgLogan 
                sloganProduct.current.style.transform = 'scale(1)'
                sloganProduct.current.style.opacity = '1'
                imgProductSlide.current[indexSlide[0]].style.top = '710px'
                imgProductSlide.current[indexSlide[0]].style.right = '190px'
                imgProductSlide.current[indexSlide[0]].style.height = '200px'
                imgProductSlide.current[indexSlide[0]].style.transform = 'rotate(-360deg)'
                imgProductSlide.current[indexSlide[0]].style.transition = `top 1s ease-out,right 1s ease-out,height 1s ease-out, transform 1s ease-out `
                desProduct.current[0].style.transform = 'translateX(20px)'
                desProduct.current[1].style.bottom = '162px'
            }
            else if (top > 620 && top < 1000) {
                imgProductSlide.current[indexSlide[0]].style.top = '1177px'
                imgProductSlide.current[indexSlide[0]].style.right = '154px'
                imgProductSlide.current[indexSlide[0]].style.height = '118px'
                imgProductSlide.current[indexSlide[0]].style.transform = 'rotate(0deg)'
                imgProductSlide.current[indexSlide[0]].style.transition = `top 1s ease-out,right 1s ease-out,height 1s ease-out, transform 1s ease-out `
                imgBestSeller.current[0].style.transform = 'translateY(0) rotate(360deg)'
                imgBestSeller.current[1].style.transform = 'translateY(0) rotate(360deg)'
                imgBestSeller.current[0].style.opacity = '1'
                imgBestSeller.current[1].style.opacity = '1'
            }
            else if(top > 1000 && top < 1300) {
                modalVideoBest.current.style.transform = 'scale(0)'
                videoBest.current.style.width = '600px'
                listProductBest.current[0].style.transform = 'translateY(0) rotate(360deg)'
                listProductBest.current[1].style.transform = 'translateY(0) rotate(-360deg)'
                listProductBest.current[2].style.transform = 'translateY(0) rotate(360deg)'
                listProductBest.current[0].style.opacity = '1'
                listProductBest.current[1].style.opacity = '1'
                listProductBest.current[2].style.opacity = '1'
            }
            else if(top > 1300 && top < 1600) {
                // gogiBackround.current.style.width = '100%'
            }
            else if(top > 1600 && top < 1700) {
                headerBodyContent.current.style.transform = 'translateX(0)'
                headerBodyContent.current.style.opacity = '1'
            }
            else if(top > 1700 && top < 2900) {
                for(let i in itemHeaderBody.current) {
                    itemHeaderBody.current[i].style.transform = 'translateY(0)'
                    itemHeaderBody.current[i].style.opacity = '1'
                }
            }
            else if(top > 2900 && top < 3300) {
                youtubeRef.current[0].style.transform = ''
                youtubeRef.current[0].style.opacity = '1'
                youtubeRef.current[1].style.transform = 'translateX(0)'
                youtubeRef.current[1].style.opacity = '1'
            }
            else if(top > 3300 && top < 3700) {
                youtubeRef.current[2].style.transform = 'translateY(0)'
            }
             else if(top > 3700 ) {  
                // bodyNhansu.current.style.width = '100%'
              }
            else if (top < 10) {
                headerBodyContent.current.style.transform = ''
                youtubeRef.current[0].style.transform = 'translateX(-114px)'
                youtubeRef.current[1].style.transform = 'translateX(130px)'
                youtubeRef.current[0].style.opacity = '0'
                youtubeRef.current[1].style.opacity = '0'
                youtubeRef.current[2].style.transform = 'translateY(150px)'
                // bodyNhansu.current.style.width = '0%'
                // gogiBackround.current.style.width = '20%'
                videoBest.current.style.width = '500px'
                 for(let i in itemHeaderBody.current) {
                    itemHeaderBody.current[i].style.transform = ''
                    itemHeaderBody.current[i].style.opacity = ''
                }
                btn.current.style.pointerEvents = 'auto'
                imgProductSlide.current[indexSlide[0]].style.top = '0'
                imgProductSlide.current[indexSlide[0]].style.right = '0'
                imgProductSlide.current[indexSlide[0]].style.height = '370px'
                imgProductSlide.current[indexSlide[0]].style.transform = 'rotate(0)'
                imgProductSlide.current[indexSlide[0]].style.transition = `top 1s ease-out,right 1s ease-out,height 1s ease-out, transform 1s ease-out `
                desProduct.current[0].style.transform = 'translateX(300px)'
                desProduct.current[1].style.bottom = '0px'
                sloganProduct.current.style.transform = 'scale(0)'
                sloganProduct.current.style.opacity = '0'
                imgBestSeller.current[0].style.transform = 'translateY(180px) rotate(0)'
                imgBestSeller.current[1].style.transform = 'translateY(180px) rotate(0)'
                imgBestSeller.current[0].style.opacity = '0'
                imgBestSeller.current[1].style.opacity = '0'
                modalVideoBest.current.style.transform = 'scale(1)'
                listProductBest.current[0].style.transform = 'translateY(180px) rotate(0)'
                listProductBest.current[1].style.transform = 'translateY(180px) rotate(0)'
                listProductBest.current[2].style.transform = 'translateY(180px) rotate(0)'
                listProductBest.current[0].style.opacity = '0'
                listProductBest.current[1].style.opacity = '0'
                listProductBest.current[2].style.opacity = '0'
                setCheckAutoNext(prev => prev + 1)
            }
          }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, [indexSlide]);
      useEffect(() => {
        if(cookies.get('AccessToken') !== undefined) {
           const newSocket = io('http://localhost:8080',{
            auth: {
                token: cookies.get('AccessToken')
            }
           });
           setSocket(newSocket)
           return () => {
            newSocket.disconnect()
        }
        }
    },[])

    return ( 
        <IdElementContext.Provider value={data}>
                {children}
        </IdElementContext.Provider>
     );
}

export {IdElementContext, IdElementProvider} ;