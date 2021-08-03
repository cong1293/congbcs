import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export const Description = {
	key: 'facebook-customer-chat',
	name: 'Plugin Chat Facebook',
	coverUrl: '/admin-assets/images/apps/messenger.png',
	description: `<p>Với Plugin chat, bạn có thể tích hợp trực tiếp trải nghiệm Messenger vào trang web của mình. Nhờ đó, khách hàng có thể tương tác với doanh nghiệp của bạn bất cứ lúc nào bằng trải nghiệm dành riêng, đa phương tiện giống như trong Messenger.</p>
  <p><img src='/admin-assets/images/apps/facebook-customer-chat-plugin.png' /></p>
  <p>Giúp bạn trò chuyện trực tiếp với khách hàng. Cho phép bạn tiếp tục cuộc ngay cả khi họ đã rời khỏi trang web của bạn. Không cần nắm bắt thông tin của họ để theo dõi, chỉ cần sử dụng cuộc trò chuyện tương tự như trong Messenger.</p>
  <p>Cách lấy ID trang Facebook của bạn:</p>
  <ol>
    <li>Vào trang Facebook của bạn.</li>
    <li>Nhấp vào Tab Giới Thiệu.</li>
    <li>Cuộn xuống cuối phần THÔNG TIN THÊM.</li>
    <li>Sao chép ID Trang của bạn và dán vào bên dưới.</li>
  </ol>`
};

const CHAT_CODE = `<div class="fb-customerchat" page_id="PAGE_ID" minimized="IS_MINIMIZED"></div>`;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageId: '',
			minimized: 'false'
		};
	}

	handlePageIdChange = event => {
		this.setState({ pageId: event.target.value });
	};

	handleMinimizedChange = event => {
		this.setState({ minimized: event.target.value });
	};

	fetchSettings = () => {
		api.apps.settings
			.retrieve('facebook-customer-chat')
			.then(({ status, json }) => {
				const appSettings = json;
				if (appSettings) {
					this.setState({
						pageId: appSettings.pageId,
						minimized: appSettings.minimized
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateSettings = () => {
		const { pageId, minimized } = this.state;
		const htmlCode =
			pageId && pageId.length > 0
				? CHAT_CODE.replace(/PAGE_ID/g, pageId).replace(
						/IS_MINIMIZED/g,
						minimized
				  )
				: '';

		api.apps.settings.update('facebook-customer-chat', {
			pageId: pageId,
			minimized: minimized
		});
		api.theme.placeholders.update('facebook-customer-chat', {
			place: 'body_end',
			value: htmlCode
		});
	};

	componentDidMount() {
		this.fetchSettings();
	}

	render() {
		return (
			<div>
				<TextField
					type="text"
					fullWidth={true}
					value={this.state.pageId}
					onChange={this.handlePageIdChange}
					floatingLabelText="Page ID"
				/>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.minimized}
					onChange={this.handleMinimizedChange}
					floatingLabelText="minimized"
					hintText="false"
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
