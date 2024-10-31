import * as Icon from 'react-feather';
import axios from 'axios';
import  { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';
import Map from './map'
import 'flatpickr';

function Dashboard() {
	const [AllBill,setAllBill] = useState(0)
	const [totalPrice,setTotalPrice] = useState(0)
	// Ref
    const canvasLine = useRef(null);
    const canvasPie = useRef(null);
    const canvasBar = useRef(null);
    const dateTime = useRef(null);
	useEffect(() => {
		axios.all([
			axios.get('http://localhost:8080/api/v12/countbill'),
			axios.get('http://localhost:8080/api/v12/sumtotalprice'),
		  ])
			.then(axios.spread((Bill,TotalPrice) => {
				setAllBill(Bill.data.data)
				setTotalPrice(TotalPrice.data.data)
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
                data: [
                    2115,
                    1562,
                    1584,
                    1892,
                    1587,
                    1923,
                    2566,
                    2448,
                    2805,
                    3438,
                    2917,
                    3327
                ]
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
                        stepSize: 1000
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
    new Chart(canvasPie.current, {
        type: "pie",
        data: {
            labels: ["Chrome", "Firefox", "IE"],
            datasets: [{
                data: [4306, 3801, 1689],
                backgroundColor: [
                    '#0d6efd',
                    '#ffc107',
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
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
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
                        stepSize: 20
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
  }, []);

    return ( 
        <>
       <h1 className="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>
       <div className="row">
						<div className="col-xl-6 col-xxl-5 d-flex">
							<div className="w-100">
								<div className="row">
									<div className="col-sm-6">
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Sales</h5>
													</div>

													<div className="col-auto">
														<div className="stat text-primary">
															<Icon.Truck className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">{AllBill}</h1>
												<div className="mb-0">
													<span className="text-danger"> <i className="mdi mdi-arrow-bottom-right"></i> -3.65% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">All</h5>
													</div>

													<div className="col-auto">
														<div className="stat text-primary">
                                                        <Icon.User className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">100</h1>
												<div className="mb-0">
													<span className="text-success"> <i className="mdi mdi-arrow-bottom-right"></i> 5.25% </span>
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
														<h5 className="card-title">Orders</h5>
													</div>

													<div className="col-auto">
														<div className="stat text-primary">
                                                        <Icon.ShoppingCart className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">64</h1>
												<div className="mb-0">
													<span className="text-success"> <i className="mdi mdi-arrow-bottom-right"></i> 6.65% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
										<div className="card">
											<div className="card-body">
												<div className="row">
													<div className="col mt-0">
														<h5 className="card-title">Earnings</h5>
													</div>

													<div className="col-auto">
													<div className="stat text-primary">														
                                                        <Icon.DollarSign className="align-middle"/>
														</div>
													</div>
												</div>
												<h1 className="mt-1 mb-3">${totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h1>
												<div className="mb-0">
													<span className="text-danger"> <i className="mdi mdi-arrow-bottom-right"></i> -2.25% </span>
													<span className="text-muted">Since last week</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-6 col-xxl-7">
							<div className="card flex-fill w-100">
								<div className="card-header">
									<h5 className="card-title mb-0">Recent Movement</h5>
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
									<h5 className="card-title mb-0">Browser Usage</h5>
								</div>
								<div className="card-body d-flex">
									<div className="align-self-center w-100">
										<div className="py-3">
											<div className="chart chart-xs">
												<canvas ref={canvasPie} id="chartjs-dashboard-pie"></canvas>
											</div>
										</div>

										<table className="table mb-0">
											<tbody>
												<tr>
													<td>Chrome</td>
													<td className="text-end">4306</td>
												</tr>
												<tr>
													<td>Firefox</td>
													<td className="text-end">3801</td>
												</tr>
												<tr>
													<td>IE</td>
													<td className="text-end">1689</td>
												</tr>
											</tbody>
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

									<h5 className="card-title mb-0">Calendar</h5>
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

									<h5 className="card-title mb-0">Latest Projects</h5>
								</div>
								<table className="table table-hover my-0">
									<thead>
										<tr>
											<th>Name</th>
											<th className="d-none d-xl-table-cell">Start Date</th>
											<th className="d-none d-xl-table-cell">End Date</th>
											<th>Status</th>
											<th className="d-none d-md-table-cell">Assignee</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Project Apollo</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-success">Done</span></td>
											<td className="d-none d-md-table-cell">Vanessa Tucker</td>
										</tr>
										<tr>
											<td>Project Fireball</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-danger">Cancelled</span></td>
											<td className="d-none d-md-table-cell">William Harris</td>
										</tr>
										<tr>
											<td>Project Hades</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-success">Done</span></td>
											<td className="d-none d-md-table-cell">Sharon Lessman</td>
										</tr>
										<tr>
											<td>Project Nitro</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-warning">In progress</span></td>
											<td className="d-none d-md-table-cell">Vanessa Tucker</td>
										</tr>
										<tr>
											<td>Project Phoenix</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-success">Done</span></td>
											<td className="d-none d-md-table-cell">William Harris</td>
										</tr>
										<tr>
											<td>Project X</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-success">Done</span></td>
											<td className="d-none d-md-table-cell">Sharon Lessman</td>
										</tr>
										<tr>
											<td>Project Romeo</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-success">Done</span></td>
											<td className="d-none d-md-table-cell">Christina Mason</td>
										</tr>
										<tr>
											<td>Project Wombat</td>
											<td className="d-none d-xl-table-cell">01/01/2023</td>
											<td className="d-none d-xl-table-cell">31/06/2023</td>
											<td><span className="badge bg-warning">In progress</span></td>
											<td className="d-none d-md-table-cell">William Harris</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-12 col-lg-4 col-xxl-3 d-flex">
							<div className="card flex-fill w-100">
								<div className="card-header">

									<h5 className="card-title mb-0">Monthly Sales</h5>
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