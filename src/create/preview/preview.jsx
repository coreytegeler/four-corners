import React from 'react';
import SchemaForm from 'react-jsonschema-form';
import Dropzone from 'react-dropzone';
import { renderToStaticMarkup } from 'react-dom/server'

import i18n from '../../i18n.jsx';
import Module from './module.jsx';

// let placeholderSrc = SiteSettings.url.theme + '/assets/images/placeholder.svg';
// placeholderSrc = 'https://i.guim.co.uk/img/media/fe09d503213527013ae12c489ad7b473f35e7a8c/0_0_6720_4480/master/6720.jpg?width=1020&quality=45&auto=format&fit=max&dpr=2&s=c23858bc511a0bc8ec8c6ab52687b6b2';

class Preview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			includeCss: false,
			includeJs: false,
			expand: false
		};
		this.imgInputRef = React.createRef();
		this.outputRef = React.createRef();
		this.includeJSRef = React.createRef();
		this.includeCSSRef = React.createRef();
	}

	componentDidMount() {
		
	}

	componentWillUnmount() {
		
	}

	onChangeOpts(e) {
		let stateChange = {
			formData: this.props.formData
		};
		if(e.target.type == 'checkbox') {
			stateChange[e.target.name] = e.target.checked;
		}
		this.setState(stateChange);
	}

	onFocus(e) {
		e.target.setSelectionRange(0, e.target.value.length);
	}

	onBlur(e) {

	}

	onError(e) {
		console.log('Error', e);
	}

	onToggle(e) {
		e.preventDefault();
		let id = e.currentTarget.parentElement.id;
		if(id==this.state.expand) {id = null}
		this.setState({
			expand: id
		});
	}

	embedCode(formData) {
		const imgLoaded = this.props.imgLoaded;
		let auxData = {
			lang: i18n.language,
		}
		let stringData = this.sanitizeCode(Object.assign(formData, auxData));
		// let imgHtml = imgLoaded ? '<img class=\'fc-img\' src=\''+formData.photo.src+'\'/>':'';
		let imgHtml = '<img class=\'fc-img\' src=\''+formData.photo.src+'\'/>';
		let stringHtml = '<div class=\'fc-embed\' data-fc=\''+stringData+'\'>'+imgHtml+'</div>';
		return stringHtml;
	}

	sanitizeCode(data) {
		let cleanData = JSON.parse(JSON.stringify(data));
		Object.keys(cleanData).forEach(function(key) {
			const value = cleanData[key];
			if(typeof value == 'object') {
				Object.keys(value).forEach(function(subKey) {
					if(typeof value[subKey] == 'string') {
						cleanData[key][subKey] = value[subKey]
							.replace(/'/g, '&apos;')
							.replace(/"/g, '\"')
							.replace(/&quot;/g, '\"')
							.replace(/“/g, '&ldquo;')
							.replace(/”/g, '&rdquo;')
							.replace(/′/g, '&prime;')
							.replace(/″/g, '&Prime;');
							// '"“”′″

					}
				});
			}
		});
		let stringData = JSON.stringify(cleanData);
		return stringData;
	}

	render() {
		const creator = this.props.creator;
		const inputClass = (this.props.imgLoaded?'has-image':'');
		const cdnVer = '1.1.2';
		const cssURL = 'https://cdn.jsdelivr.net/gh/four-corners/four-corners.js@'+cdnVer+'/dist/four-corners.min.css';
		const jsURL = 'https://cdn.jsdelivr.net/gh/four-corners/four-corners.js@'+cdnVer+'/dist/four-corners.min.js';
		const cssCDN = '<link href="'+cssURL+'" rel="stylesheet" type="text/css">';
		const jsCDN = '<script src="'+jsURL+'" type="text/javascript"></script>';
		const jsInit = '<script type="text/javascript">new FourCorners()</script>';
		return(
			<div className='col-inner'>
				<div className='col-content'>
					<div id='preview' className={inputClass}>
					
						<Module
							creator={creator}
							formData={this.props.formData}
							imgLoaded={this.props.imgLoaded}
							mediaData={this.props.mediaData}
							activeCorner={this.props.activeCorner}
							activeFieldset={this.props.activeFieldset}
							sendActiveCorner={this.props.sendActiveCorner}
							sendActiveFieldset={this.props.sendActiveFieldset}
							/>

						<div id='embed-output'>
							
							<form name='embed' onChange={this.onChangeOpts.bind(this)}>

								<fieldset id='addScripts' className={'toggler '+(this.state.expand?'expand':'collapse')}>
									<legend className='toggle-label' onClick={this.onToggle.bind(this)}>
										<span>{creator&&creator.acf ? creator.acf['scripts_title'] : null }</span>
									</legend>
									<div className="fieldset-inner">
										<div className="fields-group">
											<div className="field">
												{creator&&creator.acf&&creator.acf['scripts_desc'] ?
												<div className='desc' dangerouslySetInnerHTML={{__html: creator.acf['scripts_desc'] }}></div>
												: ''}
												<textarea className='output form-elem'
													id='libraries'
													readOnly={true}
													rows={3}
													value={jsCDN+jsInit+cssCDN}
													onFocus={this.onFocus.bind(this)}
													onBlur={this.onBlur.bind(this)} />
											</div>
										</div>
									</div>
								</fieldset>

								<fieldset id='embedPhoto'>
									<legend>
										<span>{creator&&creator.acf ? creator.acf['embed_title'] : null }</span>
									</legend>
									<div className="fieldset-inner">
										<div className="fields-group">
											<div className="field">
												{creator&&creator.acf&&creator.acf['embed_desc'] ?
												<div className='desc' dangerouslySetInnerHTML={{__html: creator.acf['embed_desc'] }}></div>
												: ''}
												<textarea className='output form-elem'
													id='json'
													readOnly={true}
													ref={this.outputRef}
													rows={3}
													value={this.embedCode(this.props.formData)}
													onFocus={this.onFocus.bind(this)}
													onBlur={this.onBlur.bind(this)} />
											</div>
										</div>
									</div>
								</fieldset>

							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Preview;