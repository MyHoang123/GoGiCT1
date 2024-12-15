import * as Icon from 'react-feather';
import axios from 'axios';
import  { useContext, useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';
import 'flatpickr';
import  {ElementContextAdmin} from '../../components/Layout/AdminLayout'
function Dashboard() {
	const [PriceDate,setPriceDate] = useState([])
	const [products,setProducts] = useState([])
	const [allAmountBill,setAllAmountBill] = useState([])
	const [infoAllBill,setInfoAllBill] = useState(null)
	// Ref
    const canvasLine = useRef(null);
    const canvasPie = useRef(null);
    const canvasBar = useRef(null);
    const dateTime = useRef(null);
	const {cookies} = useContext(ElementContextAdmin)
	useEffect(() => {
		axios.all([
			// axios.get('https://severgogi.onrender.com/api/v12/countbill'),
			// axios.get('https://severgogi.onrender.com/api/v12/sumtotalprice'),
			axios.get(`https://severgogi.onrender.com/api/v12/getproducthottrend?token=${cookies.get('AccessTokenAdmin')}`),
			axios.get(`https://severgogi.onrender.com/api/v12/getinfobillproduct?token=${cookies.get('AccessTokenAdmin')}`),
			axios.get(`https://severgogi.onrender.com/api/v12/getallpricebill?token=${cookies.get('AccessTokenAdmin')}`),
			axios.get(`https://severgogi.onrender.com/api/v12/getallbilldate?token=${cookies.get('AccessTokenAdmin')}`),
		  ])
			.then(axios.spread((Product,AllInfoBill,PriceDate,AllAmountBill) => {
				if(Product.data.massege === 'Thanh cong' && AllInfoBill.data.massege === 'Thanh cong' && PriceDate.data.massege === 'Thanh cong' && AllAmountBill.data.massege === 'Thanh cong') {
					setProducts(Product.data.data)
					setInfoAllBill(AllInfoBill.data)
					setPriceDate(PriceDate.data.data)
					setAllAmountBill(AllAmountBill.data.data)
				}
			}))
			.catch (err => {
				console.error()
			})
	},[])
useEffect(() => {
    const context = canvasLine.current.getContext('2d');
    var gradient = context.createLinearGradient(0, 0, 0, 225);
    gradient.addColorStop(0, "rgba(215, 227, 244, 1)");
    gradient.addColorStop(1, "rgba(215, 227, 244, 0)");
    // Vẽ biểu đồ bằng JavaScript thông qua context
    new Chart(canvasLine.current, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Sales ($)",
                fill: true,
                backgroundColor: gradient,
                borderColor: '#0d6efd',
                data: PriceDate
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                intersect: false
            },
            hover: {
                intersect: true
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            scales: {
                xAxes: [{
                    reverse: true,
                    gridLines: {
                        color: "rgba(0,0,0,0.0)"
                    }
                }],
                yAxes: [{
					ticks: {
						beginAtZero: true, // Bắt đầu từ 0
						stepSize: 5000, // Kích thước bước
						min: 1000, // Giá trị tối thiểu
						max: 30000, // Giá trị tối đa
						callback: function(value) { // Tùy chỉnh nhãn
							return value.toString(); // Chuyển giá trị thành chuỗi
						}
					},
                    display: true,
                    borderDash: [3, 3],
                    gridLines: {
                        color: "rgba(0,0,0,0.0)"
                    }
                }]
            }
        }
    });
    // Thực hiện các thao tác khác trên phần tử canvas
    // ...
	// Pie chart
	if(infoAllBill !== null) {
			 new Chart(canvasPie.current, {
				type: "pie",
				data: {
					labels: ["Tại quán", "Trực tuyến"],
					datasets: [{
						data: [parseInt(infoAllBill.AllBillOrder.AllCount), parseInt(infoAllBill.AllBill.AllCount)],
						backgroundColor: [
							'#0d6efd',
							'#dc3545'
						],
						borderWidth: 5
					}]
				},
				options: {
					responsive: !window.MSInputMethodContext,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					cutoutPercentage: 75
				}
			});
	}
    // Bar chart
    new Chart(canvasBar.current, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "This year",
                backgroundColor: '#0d6efd',
                borderColor: '#0d6efd',
                hoverBackgroundColor: '#0d6efd',
                hoverBorderColor: '#0d6efd',
                data: allAmountBill,
                barPercentage: .75,
                categoryPercentage: .5
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: false,
                    ticks: {
                        stepSize: 10,
						min: 0, // Giá trị tối thiểu
						max: 40, // Giá trị tối đa
                    }
                }],
                xAxes: [{
                    stacked: false,
                    gridLines: {
                        color: "transparent"
                    }
                }]
            }
        }
    });
    var date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    var defaultDate = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
    dateTime.current.flatpickr({
        inline: true,
        prevArrow: "<span title=\"Previous month\">&laquo;</span>",
        nextArrow: "<span title=\"Next month\">&raquo;</span>",
        defaultDate: defaultDate
    });
    // Map 
  }, [infoAllBill]);
    return ( 
        <>
       <h1 className="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>
       <div className="row">
		{infoAllBill !== null ? (
						<div className="col-xl-6 col-xxl-5 d-flex">
							<div className="w-100">
								<div className="row">
									<div className="col-sm-6">
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Lượt bán</h5>
													</div>
													<div className="col-auto">
														<div className="stat text-primary">
															<Icon.Truck className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">{infoAllBill.All.AllCount}</h1>
												<div className="mb-0">
													<span className={infoAllBill.All.Since_last_week > 0 ? "text-success" : "text-danger"}><i className="mdi mdi-arrow-bottom-right"></i>{infoAllBill.All.Since_last_week}%</span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Trực tuyến</h5>
													</div>

													<div className="col-auto">
														<div className="stat text-primary">
                                                        <Icon.User className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">{infoAllBill.AllBill.AllCount}</h1>
												<div className="mb-0">
													<span className={infoAllBill.AllBill.Since_last_week > 0 ? "text-success" : "text-danger"}> <i className="mdi mdi-arrow-bottom-right"></i> {infoAllBill.AllBill.Since_last_week}% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Tại quán</h5>
													</div>
													<div className="col-auto">
														<div className="stat text-primary">
                                                        <Icon.ShoppingCart className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">{infoAllBill.AllBillOrder.AllCount}</h1>
												<div className="mb-0">
													<span className={infoAllBill.AllBillOrder.Since_last_week > 0 ? "text-success" : "text-danger"}> <i className="mdi mdi-arrow-bottom-right"></i> {infoAllBill.AllBillOrder.Since_last_week}% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Doanh thu</h5>
													</div>

													<div className="col-auto">
													<div className="stat text-primary">														
                                                        <Icon.DollarSign className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">{infoAllBill.TotalAll.AllCount}</h1>
												<div className="mb-0">
													<span className={infoAllBill.TotalAll.Since_last_week > 0 ? "text-success" : "text-danger"}> <i className="mdi mdi-arrow-bottom-right"></i> {infoAllBill.TotalAll.Since_last_week}% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
		) : null}

						<div className="col-xl-6 col-xxl-7">
							<div className="card flex-fill w-100">
								<div className="card-header">
									<h5 className="card-title mb-0">Biểu đồ doanh thu theo tháng</h5>
								</div>
								<div className="card-body py-3">
									<div className="chart chart-sm">
										<canvas ref={canvasLine} id="chartjs-dashboard-line"></canvas>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3">
							<div className="card flex-fill w-100">
								<div className="card-header">
									<h5 className="card-title mb-0">Đơn hàng</h5>
								</div>
								<div className="card-body d-flex">
									<div className="align-self-center w-100">
										<div className="py-3">
											<div className="chart chart-xs">
												<canvas ref={canvasPie} id="chartjs-dashboard-pie"></canvas>
											</div>
										</div>

										<table className="table mb-0">
											{infoAllBill !== null ? (
												<tbody>
													<tr>
														<td>Tại quán</td>
														<td className="text-end">{infoAllBill.AllBillOrder.AllCount}</td>
													</tr>
													<tr>
														<td>Trực tuyến</td>
														<td className="text-end">{infoAllBill.AllBill.AllCount}</td>
													</tr>
												</tbody>
											) : null}
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-12 col-xxl-6 d-flex order-3 order-xxl-2">
							<div className="card flex-fill w-100">
								<div className="card-header">
									<h5 className="card-title mb-0">Real-Time</h5>
								</div>
								<div className="card-body px-4">
									<div id="world_map" style={{height: '350px'}}>
										<iframe width='100%' height='360px' src="https://api.mapbox.com/styles/v1/myhoang123/cm1llsbv100i401phgj17f27f/draft.html?title=false&access_token=pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ&zoomwheel=false#0.96/33.4/-66.1" title="Untitled" style={{border:'none'}}></iframe>		
                                    </div>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1">
							<div className="card flex-fill">
								<div className="card-header">
									<h5 className="card-title mb-0">Lịch</h5>
								</div>
								<div className="card-body d-flex">
									<div className="align-self-center w-100">
										<div className="chart">
											<div ref={dateTime} id="datetimepicker-dashboard" ></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-lg-8 col-xxl-9 d-flex">
							<div className="card flex-fill">
								<div className="card-header">
									<h5 className="card-title mb-0">Sản phẩm bán chạy</h5>
								</div>
								<table className="table table-hover my-0">
									<thead>
										<tr>
											<th>Tên</th>
											<th className="d-none d-xl-table-cell">Giá</th>
											<th className="d-none d-xl-table-cell">Loại</th>
											<th>Sao</th>
											<th className="d-none d-md-table-cell">Lượt bán</th>
										</tr>
									</thead>
									<tbody>
									{products.map((product,index) => (
										<tr key={index}>
											<td>{product.Name}</td>
											<td className="d-none d-xl-table-cell">{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</td>
											<td className="d-none d-xl-table-cell">{product.NameCate}</td>
											<td><span className={product.Star === 5 ? "badge bg-success" : "badge bg-warning"}>{product.Star} sao</span></td>
											<td className="d-none d-md-table-cell">{product.Sales}</td>
										</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-12 col-lg-4 col-xxl-3 d-flex">
							<div className="card flex-fill w-100">
								<div className="card-header">

									<h5 className="card-title mb-0">Lượt bán theo tháng</h5>
								</div>
								<div className="card-body d-flex w-100">
									<div className="align-self-center chart chart-lg">
										<canvas ref={canvasBar} id="chartjs-dashboard-bar"></canvas>
									</div>
								</div>
							</div>
						</div>
					</div>

        </>
     );
}

export default Dashboard;