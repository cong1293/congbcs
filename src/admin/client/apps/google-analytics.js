import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export const Description = {
	key: 'google-analytics',
	name: 'Google Analytics',
	coverUrl: '/admin-assets/images/apps/google_analytics.png',
	description: `Google Analytics là một dịch vụ phân tích miễn phí của Google cho phép tạo ra các bảng thống kê chi tiết về cách mà khách hàng đã ghé thăm một trang web. cung cấp cho bạn các công cụ cần thiết để phân tích dữ liệu về doanh nghiệp của bạn ở cùng một nơi, nhờ đó, bạn có thể đưa ra quyết định sáng suốt hơn.
  <p>Ứng dụng này ghi lại các lượt xem trang và các sự kiện Thương mại điện tử nâng cao gồm:</p>
  <ol>
    <li>Xem trang</li>
    <li>Xem sản phẩm</li>
    <li>Tìm kiếm</li>
    <li>Thêm/Xoá sản phẩm khỏi giỏ hàng</li>
    <li>Thanh toán</li>
    <li>Chọn phương thức vận chuyển</li>
    <li>Chọn phương thức thanh toán</li>
    <li>Thanh toán</li>
  </ol>
  <p>Ứng dụng này sẽ thêm gtag.js vào trang web của bạn. Thẻ trang web toàn cầu (gtag.js) là một khuôn khổ gắn thẻ JavaScript và API được tổ chức hợp lý, cho phép bạn gửi dữ liệu sự kiện đến Google Analytics - cho phép bạn dễ dàng kiểm soát trang web tốt hơn. Sử dụng gtag.js để nhận các tính năng theo dõi và tích hợp mới nhất khi chúng có sẵn.</p>`
};

const GTAG_CODE = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>`;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trackingId: ''
		};
	}

	handleTrackingIdChange = event => {
		this.setState({
			trackingId: event.target.value
		});
	};

	fetchSettings = () => {
		api.apps.settings
			.retrieve('google-analytics')
			.then(({ status, json }) => {
				const appSettings = json;
				if (appSettings) {
					this.setState({ trackingId: appSettings.GA_TRACKING_ID });
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateSettings = () => {
		const { trackingId } = this.state;
		const gtag =
			trackingId && trackingId.length > 0
				? GTAG_CODE.replace(/GA_TRACKING_ID/g, trackingId)
				: '';

		api.apps.settings.update('google-analytics', {
			GA_TRACKING_ID: trackingId
		});
		api.theme.placeholders.update('google-analytics', {
			place: 'head_start',
			value: gtag
		});
	};

	componentDidMount() {
		this.fetchSettings();
	}

	render() {
		return (
			<div>
				<div>
					Nhập Tracking ID từ Google Analytics của bạn để theo dõi các lượt xem trang và các sự kiện khác.
				</div>

				<TextField
					type="text"
					value={this.state.trackingId}
					onChange={this.handleTrackingIdChange}
					floatingLabelText="Tracking ID"
					hintText="UA-XXXXXXXX-X"
				/>

				<div style={{ textAlign: 'right' }}>
					<RaisedButton
						label={messages.save}
						primary={true}
						disabled={false}
						onClick={this.updateSettings}
					/>
				</div>
			</div>
		);
	}
}
