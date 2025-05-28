import { useEffect, useState } from 'react';
import useTranslations from '@/hooks/useTranslations';
import Script from 'next/script';
import siteConfig from '@/lib/siteConfig';

const Newsletter = ({ translations }) => {
  const { t } = useTranslations(translations);
  const [isMounted, setIsMounted] = useState(false);

  const mailerliteFormId = siteConfig.mailerlite_form_id;
  const mailerliteUniversal = siteConfig.mailerlite_universal;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use Next.js Script component for client-side loading
  const scriptContent = `
    (function(w,d,e,u,f,l,n){
      w[f]=w[f]||function(){
        (w[f].q=w[f].q||[])
        .push(arguments);}
      l=d.createElement(e);
      l.async=1;
      l.src=u;
      n=d.getElementsByTagName(e)[0];
      n.parentNode.insertBefore(l,n);
    })
    (window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
    ml('account', '${mailerliteUniversal}');
  `;
  // Check for both mounted state and configuration
  if (!isMounted) {
    // Return a placeholder with the same dimensions during server-side rendering
    return <div className="newsletter" aria-hidden="true" />;
  }
    if (!mailerliteFormId || !mailerliteUniversal) {
    return <p>Newsletter configuration is missing.</p>;
  }
  return (
    <div className="newsletter">
      <div className="newsletterContainer">
        {/* Add Script component for client-side loading */}
        <Script id="mailerlite-script" strategy="lazyOnload">
          {scriptContent}
        </Script>
        {/* MailerLite CSS - Consider moving to a global stylesheet or _app.js if it affects multiple pages */}
        {/* Or, if scoped to this component, use styled-jsx or CSS Modules */}
        <style jsx global>{`
          @import url("https://assets.mlcdn.com/fonts.css?version=1745574");
          /* LOADER */
          .ml-form-embedSubmitLoad {
            display: inline-block;
            width: 20px;
            height: 20px;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            border: 0;
          }
          .ml-form-embedSubmitLoad:after {
            content: " ";
            display: block;
            width: 11px;
            height: 11px;
            margin: 1px;
            border-radius: 50%;
            border: 4px solid #fff;
            border-color: #ffffff #ffffff #ffffff transparent;
            animation: ml-form-embedSubmitLoad 1.2s linear infinite;
          }
          @keyframes ml-form-embedSubmitLoad {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer {
            box-sizing: border-box;
            display: table;
            margin: 0 auto;
            position: static;
            width: 100% !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer h4,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer p,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer span,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer button {
            text-transform: none !important;
            letter-spacing: normal !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper {
            background-color: #f6f6f6; /* Match your theme */
            border-width: 0px;
            border-color: transparent;
            border-radius: 4px;
            border-style: solid;
            box-sizing: border-box;
            display: inline-block !important;
            margin: 0;
            padding: 0;
            position: relative;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper.embedPopup,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper.embedDefault { width: 400px; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper.embedForm { max-width: 400px; width: 100%; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-align-left { text-align: left; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-align-center { text-align: center; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-align-default { display: table-cell !important; vertical-align: middle !important; text-align: center !important; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-align-right { text-align: right; }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedHeader img {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            height: auto;
            margin: 0 auto !important;
            max-width: 100%;
            /* width: undefinedpx; */ /* Removed as it was invalid */
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody {
            padding: 20px 20px 0 20px;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody.ml-form-embedBodyHorizontal {
            padding-bottom: 0;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent {
            text-align: left;
            margin: 0 0 20px 0;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 {
            color: #000000; /* Match your theme */
            font-family: 'Open Sans', Arial, Helvetica, sans-serif;
            font-size: 30px;
            font-weight: 400;
            margin: 0 0 10px 0;
            text-align: left;
            word-break: break-word;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
            color: #000000; /* Match your theme */
            font-family: 'Open Sans', Arial, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 20px;
            margin: 0 0 10px 0;
            text-align: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ul,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ul,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol {
            color: #000000; /* Match your theme */
            font-family: 'Open Sans', Arial, Helvetica, sans-serif;
            font-size: 14px;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol {
            list-style-type: lower-alpha;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol ol,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol ol {
            list-style-type: lower-roman;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p a,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p a {
            color: #000000; /* Match your theme */
            text-decoration: underline;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group {
            text-align: left !important;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group label {
            display: inline-block;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: bold;
            line-height: 24px;
            margin-bottom: 5px;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-checkboxRow {
            margin: 0 0 20px 0;
            width: 100%;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-checkboxRow {
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm {
            margin: 0;
            padding: 0 0 20px 0;
            width: 100%;
            height: auto;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow {
            height: auto;
            width: 100%;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal {
            width: 70%;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-button-horizontal {
            width: 30%;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow input {
            margin: 0 0 10px 0;
            width: 100%;
            box-sizing: border-box;
            height: 40px;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow button,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-formContent.horozintalForm .ml-form-horizontalRow button:hover {
            width: 100% !important;
            height: 40px !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.ml-subscribe-form-input {
            background-color: #ffffff !important;
            border: 1px solid #cccccc !important;
            border-radius: 4px !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            color: #333333 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 14px !important;
            height: auto;
            line-height: 20px !important;
            margin: 0 0 10px 0 !important;
            padding: 10px 10px !important;
            width: 100% !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control::-webkit-input-placeholder,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.ml-subscribe-form-input::-webkit-input-placeholder {
            color: #333333 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control::-moz-placeholder,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.ml-subscribe-form-input::-moz-placeholder {
            color: #333333 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control:-ms-input-placeholder,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.ml-subscribe-form-input:-ms-input-placeholder {
            color: #333333 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
          }

          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control:-moz-placeholder,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.ml-subscribe-form-input:-moz-placeholder {
            color: #333333 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.is-invalid,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent .form-control.is-invalid.ml-subscribe-form-input {
            border-color: #ff0000 !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .form-check-label,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description {
            color: #000000 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            line-height: 18px !important;
            padding: 0px 0px 0px 5px;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow input[type="checkbox"] {
            margin: 0 5px 0 0;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description p,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .label-description p span {
            font-size: 12px !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label.custom-control-label p a,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow label.custom-control-label span a {
            color: #000000 !important;
            text-decoration: underline !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-control {
            margin: 0 0 10px 0;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-checkbox .custom-control-label::before,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-radio .custom-control-label::before {
            border-color: #000000 !important;
            background-color: #ffffff !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-checkbox .custom-control-input:checked~.custom-control-label::before,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-radio .custom-control-input:checked~.custom-control-label::before {
            border-color: #007bff !important;
            background-color: #007bff !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-checkbox .custom-control-input:checked~.custom-control-label::after,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-radio .custom-control-input:checked~.custom-control-label::after {
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Cpath stroke='%23fff' d='M-2 0l3 3l5-5'/%3E%3C/svg%3E") /* Match your theme */
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-checkbox .custom-control-label::after,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-radio .custom-control-label::after {
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Cpath stroke='%23fff' d='M-2 0l3 3l5-5'/%3E%3C/svg%3E") /* Match your theme */
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow .custom-checkbox .custom-control-input:focus~.custom-control-label::before {
            box-shadow: none !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-hidden {
            display: none !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-recaptcha {
            margin: 0 0 20px 0;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-recaptcha.horozintalForm {
            margin: 0;
            padding: 0 0 20px 0;
            width: 100%;
            height: auto;
            float: left;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-error,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-validationRow.ml-error {
            border: 1px solid #ff0000 !important;
            border-radius: 4px;
            display: block;
            font-size: 12px;
            margin: 0 0 10px 0;
            padding: 10px;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-error p,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-validationRow.ml-error p {
            color: #ff0000 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            line-height: 1 !important;
            margin: 0 !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-error ul,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-validationRow.ml-error ul {
            color: #ff0000 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 0 0 20px !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-error ol,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-validationRow.ml-error ol {
            color: #ff0000 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 0 0 20px !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-error li,
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-validationRow.ml-error li {
            color: #ff0000 !important;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 12px !important;
            line-height: 1 !important;
            margin: 0 !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedFooter {
            background-color: #f6f6f6; /* Match your theme */
            border-top: 1px solid #f0f0f0;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            padding: 10px 20px;
            text-align: center;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedFooter p {
            color: #000000; /* Match your theme */
            font-family: 'Open Sans', Arial, Helvetica, sans-serif;
            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedFooter p a {
            color: #000000; /* Match your theme */
            text-decoration: underline;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit {
            margin: 0 0 20px 0;
            float: left;
            width: 100%;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit.horozintalForm {
            margin: 0;
            padding: 0 0 20px 0;
            width: 100%;
            height: auto;
            float: left;
          }          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit button {
            background-color: #3CBCB8 !important; /* Use site accent color */
            border: none !important;
            border-radius: 4px !important;
            box-shadow: none !important;
            color: #ffffff !important; /* Match your theme */
            cursor: pointer;
            font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
            font-size: 16px !important;
            font-weight: bold !important;
            height: auto;
            line-height: 24px !important;
            padding: 10px 20px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit button:hover {
            background-color: #2da8a4 !important; /* Darker accent color for hover */
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit button.loading {
            opacity: 0.6;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit button .ml-form-embedSubmitLoad {
            margin: 0 10px 0 0;
            vertical-align: middle;
          }
          #mlb2-${mailerliteFormId}.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedSubmit button:disabled {
            background-color: #cccccc !important;
            cursor: not-allowed;
          }
          .ml-subscribe-close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            font-size: 20px;
            color: #000000; /* Match your theme */
          }
        `}</style>

        <div id={`mlb2-${mailerliteFormId}`} className={`ml-form-embedContainer ml-subscribe-form ml-subscribe-form-${mailerliteFormId}`}>
          <div className="ml-form-embedWrapper embedForm">
            {/* Header can be added here if needed, e.g., from translations */}
            {/* <div className="ml-form-embedHeader"></div> */}

            <div className="ml-form-embedBodyContainer">
              <div className="ml-form-embedBody ml-form-embedBodyDefault row-form">                <div className="ml-form-embedContent">
                  <h4>{t('global.newsletter')}</h4>
                  <p>{t('global.newsletter_signup')}</p>
                </div>
                <form className="ml-block-form" action={`https://assets.mailerlite.com/jsonp/${mailerliteUniversal}/forms/${mailerliteFormId}/subscribe`} data-code="" method="post" target="_blank">
                  <div className="ml-form-formContent">
                    <div className="ml-form-fieldRow">
                      <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">                        <label htmlFor={`fields[email]-${mailerliteFormId}`} className="sr-only">{t('global.email')}</label>
                        <input 
                          aria-label="email" 
                          aria-required="true" 
                          type="email" 
                          className="form-control" 
                          data-inputmask="" 
                          name="fields[email]" 
                          id={`fields[email]-${mailerliteFormId}`} 
                          placeholder={t('global.email')} 
                        />
                      </div>
                    </div>
                  </div>
                  {/* Hidden fields for MailerLite */}
                  <input type="hidden" name="ml-submit" value="1" />
                  <div className="ml-form-embedSubmit">
                    <button type="submit" className="primary">
                      {t('global.subscribe')}
                    </button>
                    <button disabled type="button" className="loading" style={{display: 'none'}}>
                      <div className="ml-form-embedSubmitLoad"></div>
                      <span className="sr-only">Loading...</span>
                    </button>
                  </div>
                  <input type="hidden" name="anticsrf" value="true" />
                </form>
              </div>
            </div>
            <div className="ml-form-successBody row-success" style={{display: 'none'}}>
              <div className="ml-form-successContent">
                <h4>{t('global.newsletter_thank_you') || 'Thank you!'}</h4>
                <p>{t('global.newsletter_success') || 'You have successfully subscribed to our newsletter.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
