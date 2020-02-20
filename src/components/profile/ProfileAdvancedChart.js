import React, { Component } from 'react';
import Highcharts from 'highcharts';
import LoadingMessage from '../messages/LoadingMessage';
import ErrorMessage from '../messages/ErrorMessage';

class ProfileAdvancedChart extends Component {
	componentDidUpdate() {
		const chartWrapperElement = document.getElementById('chart-wrapper');
		if (chartWrapperElement) {
			this.renderChart();
		}
	}

	render() {
		const { submitted, loading, error } = this.props;

		if (!submitted || loading || error) {
			const chartWrapperElement = document.getElementById('chart-wrapper');
			if (chartWrapperElement) {
				chartWrapperElement.innerHTML = null;
			}

			let textContent;

			if (!submitted) {
				textContent = <h2>{'Chart will load here'}</h2>;
			} else if (loading) {
				textContent = <LoadingMessage size="h2" />;
			} else if (error) {
				textContent = <ErrorMessage error={error} primarySize="h2" />;
			}

			return (
				<div className="chart d-flex flex-centre-xy">
					<div>
						{textContent}
					</div>
				</div>
			);
		}

		return (
			<div className="chart full-width d-flex flex-centre-xy">
				<div id="chart-wrapper" className="full-width">
					{/*data.timePeriodData.map((dataEntry, i) => {
						const { numTransactions, transactionsValue, pointsAwarded } = dataEntry;
						let timePeriodInfoStr;

						if (dataEntry.numTransactions) {
							const transactionsStr = (
								`${dataEntry.numTransactions} transactions worth ${dataEntry.transactionsValue.monetary}`
							);
							const pointsStr = `${dataEntry.pointsAwarded} points awarded`;
							timePeriodInfoStr = `${transactionsStr}, ${pointsStr}`;
						} else {
							timePeriodInfoStr = 'No transactions';
						}

						return (
							<div key={i}>
								<strong>{dataEntry.name}</strong> - {timePeriodInfoStr}
							</div>
						);
					})*/}
				</div>
			</div>
		);
	}

	renderChart = () => {
		const { data } = this.props;
		Highcharts.chart('chart-wrapper', {
			chart: {
				type: 'column',
				// zoomType: 'xy',
				backgroundColor: '#ddd'
			},
			credits: {
				enabled: false
			},
			title: {
				text: 'Transactions'
			},
			subtitle: {
				text: data.subtitle
			},
			xAxis: {
				title: {
					text: data.xAxisName
				},
				categories: data.timePeriodData.map(dataEntry => dataEntry.name)
			},
			yAxis: [
				{
					title: {
						text: 'Number of transactions'
					},
					allowDecimals: false
				},
				{
					title: {
						text: 'Value of transactions'
					},
					labels: {
						formatter: function() {
							return `£${this.value / 100}`;
						}
					},
					opposite:true
				}
			],
			series: [
				{
					name: 'Number of transactions',
					yAxis: 0,
					data: data.timePeriodData.map(dataEntry => dataEntry.numTransactions)
				},
				{
					name: 'Value of transactions',
					yAxis: 1,
					data: data.timePeriodData.map(dataEntry => dataEntry.transactionsValue.raw),
					tooltip: {
						pointFormatter: function() {
							const valueStr = `£${this.y / 100}`,
								circleStr = `<span style="color: ${this.color}">\u25CF</span>`;
							return `${circleStr} ${this.series.name}: <b>${valueStr}</b><br>`;
						}
					}
				}
			]
		});
	}
}

export default ProfileAdvancedChart;