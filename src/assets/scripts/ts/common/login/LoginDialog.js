define("ts/common/login/LoginDialog",[
    "ts/widgets/TSDialog",
    "ts/widgets/TSWizardStep",
    "ts/events/TSEvent",
    "ts/events/TSMessageEvent",
    "dojo/text!./htm/LoginDialog.htm",
    "dojo/css!./css/LoginDialog.css",
    "dojo/nls!./nls/Login.json",
    "jsm/util/Locale",
    "jquery",
    "ts/util/Cryption!"
],function(TSDialog,TSWizardStep,TSEvent,TSMessageEvent,htm,css,json,Locale,$,Cryption){
    "use strict";
    var __super__=TSDialog.prototype;
    var session=request.session,
        application=request.application;
    var i18n=TSDialog.prototype.i18n.createBranch(json),
        Keys={
            ENTER:13
        };
    SetEnumValues(LoginDialog,READ_ONLY|DONT_ENUM,[
        "USER",0,
        "DEPLOYMENT_ENGINE",1,
        "USER_DATA",2
    ],"object");
    "constructor";
    /**
     * @namespace ts.common.login
     * @class LoginDialog
     * @extends ts.widgets.TSDialog
     * @constructor
     * @param {String} id
     * @param {Object} [initParams]
     */
    function LoginDialog(id,initParams){
        __super__.constructor.call(this,id,initParams);
        this.eventType = {
            LoginSuccess: "loginSuccess",
            LoginFail: "loginFail"
        };
        init.call(this);
        this.initialize.apply(this,arguments);
    }
    "private";
    function init(){
        InstallEvents(this,[
            /**
             * @event open
             */
            "open",
            /**
             * @event close
             */
            "close"
        ]);
        defineProperties.call(this);
        addEventListeners.call(this);
        this.visible=false;
        this.closeOnEsc=false;
    }
    function defineProperties(){
        /**
         * @attribute title
         * @type String
         */
        this.__data__.title="";
        InstallGetterSetter(this,"title",
            function getTitle(){
                return this.__data__.title=this.roles.get("title").textContent;
            },
            function setTitle(v){
                this.__data__.title=this.roles.get("title").textContent=v;
            }
        );
    }
    function addEventListeners(){
        var that=this;
        var close_clickHandler=function(){
            var canceled=!that.dispatchEvent(new TSEvent("beforeclose"));
            if(canceled){return;};
            that.close();
        };
    }
    "public";
    /**
     * @method open
     */
    function open(){
        if(this.visible){return;}
        __super__.show.call(this);
        this.dispatchEvent(new TSEvent("open"));
    }
    /**
     * @method close
     */
    function close(){
        if(!this.visible){return;}
        __super__.hide.call(this);
        this.dispatchEvent(new TSEvent("close"));
    }
    var methods = {
        initialize: function(opts) {
            var that = this;
            this.opts = $.extend({}, opts);
            this.container = $(this.rootElement);
            ko.validation.configure({
                decorateInputElement: true,
                registerExtenders: true,
                messagesOnModified: true,
                insertMessages: false,
                parseInputAttributes: true,
                errorClass: 'has-error'
            });

            ko.validation.configuration.insertMessages = false;
            function ViewModel() {
                var rememberMe=application.getAttribute("rememberMe")==="on";
                var self = this;
                if (rememberMe) {
                    that.role("checkedIcon").classList.add("checked");
                    that.role("rem").checked = true;
                } else {
                    that.role("checkedIcon").classList.remove("checked");
                    that.role("rem").checked = false;
                }
                self.username = ko.observable(session.getAttribute("uid")||application.getAttribute("uid")||"");
                self.userpass = ko.observable(session.getAttribute("pwd")||application.getAttribute("pwd")||"");
                self.lang = ko.observable(request.language);

                session.removeAttribute("uid");
                session.removeAttribute("pwd");
                self.username.extend({
                    required: {
                        message:i18n.getMessage("userName_VALUEMISSING"),
                        params: true
                    },
                    pattern: {
                        message:i18n.getMessage("userName_PATTERNMISMATCH"),
                        params: '^[a-zA-Z][a-zA-Z0-9_-]{1,31}$'
                    }
                });
                self.userpass.extend({
                    required: {
                        message:i18n.getMessage("password_VALUEMISSING"),
                        params: true
                    },
                    pattern: {
                        message:i18n.getMessage("password_PATTERNMISMATCH"),
                        params: '^[\x00-\xff]{6,32}$'
                    }
                });
                self.login = function() {
                    that.login(ko.toJS(self));
                };
                return self;
            }
            that.role("uid").addEventListener("keydown",function(e) {
                if(e.keyCode===Keys.ENTER && this.value) {
                    that.role("pwd").focus();
                }
            });
            that.role("pwd").addEventListener("keydown",function(e) {
                if(e.keyCode===Keys.ENTER) {
                    if(this.value) {
                        this.blur();
                        that.vm.login();
                    }
                }
            });
            request.acceptLanguages.forEach(function(lang) {
                var locale=Locale.forLanguageTag(lang);
                this.options.add(new Option(locale.displayName,lang));
            },that.role("lang"));
            that.role("lang").addEventListener("change",function() {
                application.setAttribute("lang",this.value);
                session.setAttribute("uid",that.role("uid").value);
                session.setAttribute("pwd",that.role("pwd").value);
                location.reload(true);
            });
            if(!!session.getAttribute("dont_reload")) {
                session.removeAttribute("dont_reload");
                that.role("lang").disabled=true;
            }
            that.role("rem").addEventListener("change",function() {
                if(this.checked) {
                    application.setAttribute("rememberMe","on");
                    this.parentNode.classList.add("checked");
                }else{
                    application.removeAttribute("rememberMe");
                    this.parentNode.classList.remove("checked");
                }
            });
            this.vm = new ViewModel();
            this.vm.errors = ko.validation.group(this.vm);
            ko.applyBindings(this.vm, this.container[0]);
        },
        login: function(data) {
            if(this.validate()) {
                var that = this;
                application.setAttribute("uid",this.vm.username());
                var rememberMe = application.getAttribute("rememberMe");
                if(rememberMe==='on'){
                    application.setAttribute("pwd",this.vm.userpass());
                    data.rememberMe = "on";
                }else{
                    application.removeAttribute("pwd");
                    data.rememberMe = "off";
                }

                if(request.onLine) {
                    data.userpass=Cryption.encryptKey(data.userpass);
                }
                $.post('/LoginAction.do?method=login', data, function(data) {
                    if(data.flag==='1' && typeof data.items[0]==="object") {
                        var account=data.items[LoginDialog.USER];
                        if(account instanceof Object) {
                            session.setAttribute("account",JSON.stringify(account));
                        }
                        request.userData=data.items[LoginDialog.USER_DATA]||{};
                    }
                    if(data.flag === '1') {
                        var e=new TSMessageEvent(that.eventType.LoginSuccess, {
                            data: data
                        });
                        that.dispatchEvent(e);
                    }else{
                        that.roles.get("return-message").textContent = data.msg;
                        var e=new TSMessageEvent(that.eventType.LoginFail, {
                            data: data
                        });
                        that.dispatchEvent(e);
                    }
                });
            };

        },
        validate: function() {
            this.roles.get("return-message").textContent = "";
            if (this.vm.errors().length == 0) {
                //可以提交数据了.
                return true;
            } else {
                this.vm.errors.showAllMessages();
                return false;
            }
        },
        onLoginSuccess: function(handler) {
            this.addEventListener(this.eventType.LoginSuccess, handler );
        },
        onLoginFail: function(handler) {
            this.addEventListener(this.eventType.LoginFail, handler );
        }
    };
    ExtendClass(LoginDialog,TSDialog);
    InstallFunctions(LoginDialog.prototype,DONT_DELETE,[
        "open",open,
        "close",close
    ]);
    InstallFunctions(LoginDialog.prototype, DONT_ENUM, MapToList(methods));
    SetProperties(LoginDialog.prototype,DONT_ENUM,[
        "template",htm,
        "i18n",i18n
    ]);
    SetNativeFlag(LoginDialog);
    return LoginDialog;
});
