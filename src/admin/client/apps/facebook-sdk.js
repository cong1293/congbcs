import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export const Description = {
	key: 'facebook-sdk',
	name: 'Facebook SDK',
	coverUrl: '/admin-assets/images/apps/facebook.png',
	description: `SDK Facebook dành cho JavaScript cung cấp nhiều chức năng phía Client:
  <ol>
    <li>Cho phép bạn sử dụng Nút Thích và các Plugin xã hội khác trên trang web của bạn.</li>
    <li>Cho phép bạn sử dụng Đăng nhập Facebook để giảm rào cản cho mọi người đăng ký trên trang web của bạn.</li>
    <li>Giúp dễ dàng gọi vào Graph API. của Facebook.</li>
    <li>Khởi chạy Hộp thoại cho phép mọi người thực hiện các hành động khác nhau như chia sẻ câu chuyện.</li>
    <li>Tạo điều kiện giao tiếp khi bạn đang xây dựng một trò chơi hoặc một tab ứng dụng trên Facebook.</li>
  </ol>
  <p>Facebook SDK cho JavaScript không có bất kỳ tệp độc lập nào cần được tải xuống hoặc cài đặt, thay vào đó, bạn chỉ cần bao gồm một đoạn mã ngắn của JavaScript thông thường trong HTML của mình để tải SDK vào các trang của bạn một cách không đồng bộ Asynchronous. Tải không đồng bộ có nghĩa là nó không chặn tải các phần tử khác trên trang của bạn.</p>`
};

const FACEBOOK_CODE = `<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId            : 'YOUR_APP_ID',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/YOUR_LOCALE/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>`;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appId: '',
			locale: 'en_US'
		};
	}

	handleAppIdChange = event => {
		this.setState({ appId: event.target.value });
	};

	handleLocaleChange = event => {
		this.setState({ locale: event.target.value });
	};

	fetchSettings = () => {
		api.apps.settings
			.retrieve('facebook-sdk')
			.then(({ status, json }) => {
				const appSettings = json;
				if (appSettings) {
					this.setState({
						appId: appSettings.appId,
						locale: appSettings.locale
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateSettings = () => {
		const { appId, locale } = this.state;
		const htmlCode =
			appId && appId.length > 0
				? FACEBOOK_CODE.replace(/YOUR_APP_ID/g, appId).replace(
						/YOUR_LOCALE/g,
						locale
				  )
				: '';

		api.apps.settings.update('facebook-sdk', { appId: appId, locale: locale });
		api.theme.placeholders.update('facebook-sdk', {
			place: 'body_start',
			value: htmlCode
		});
	};

	componentDidMount() {
		this.fetchSettings();
	}

	render() {
		return (
			<div>
				<div>Bạn có thể tìm thấy ID ứng dụng tại Trang tổng quan của Developers Facebook App.</div>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.appId}
					onChange={this.handleAppIdChange}
					floatingLabelText="App ID"
				/>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.locale}
					onChange={this.handleLocaleChange}
					floatingLabelText="Locale"
					hintText="en_US"
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
