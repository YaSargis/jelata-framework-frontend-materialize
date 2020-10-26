
import { compose, withState, withHandlers, lifecycle, withStateHandlers } from 'recompose';
import { notification } from 'antd';

import { apishka } from 'src/libs/api';

const enhance = compose(
    withStateHandlers(
        ({
            inState = {
                legacy: true, ecp: {}, arr_scp: []
            }
        }) => ({
            legacy: inState.legacy, select_scp: inState.ecp, sertificats: inState.arr_scp
        }),
        {
            set_state: (state) => (obj) => {
                let _state = {...state};
                _.keys(obj).map( k => { _state[k] = obj[k] })
                return _state;
            },
            setTypeLogin: (state) => (status = true, arr_sert = state.sertificats) => {
                return {
                    ...state, legacy: status, sertificats: arr_sert
                }
            },
            onSelectSert: (state) => (cert = {}) => ({
                ...state, select_scp: cert
            })
        }
    ),
    withState('login', 'changeLogin', ''),
    withState('password', 'changePassword', ''),
    withHandlers({
        onECP: ({ sertificats = [], legacy = true, set_state, setTypeLogin }) => () => {
            set_state({
                ready: false
            });

            if(_.isEmpty(sertificats)) {
                if(authorize) {
                    authorize.ecpInit().then(res => {
                        setTypeLogin(!legacy, res.certs)
                    }).catch(err => {
                        notification.error({
                            message: 'Error',
                            description: err.status || 'Can not found the module'
                        });
                        set_state({
                            ready: true
                        });
                    });
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Can not fount the module'
                    });
                    set_state({
                        ready: true
                    });
                }
            } else setTypeLogin(!legacy);
        }
    }),
    withHandlers({
        handleSubmit: ({ form, legacy, select_scp/*, set_login_status */}) => (event) => {
            event.preventDefault();
            if(legacy === true) {
                form.validateFields((err, values) => {
                    if (!err) {
                        apishka( 'POST',    {
                                login: values.username,
                                pass: values.password
                            }, '/auth/auth_f', (res) => {
                                // set_login_status(true);
    				            location.href='/'
                            }
                        )
                    }
                })
            } else {
                apishka( 'POST', select_scp, '/auth/auth_crypto', (res) => {
                        // set_login_status(true);
                        location.href='/'
                    }
                )
            }
        }
    }),
    lifecycle({
        componentDidMount() {
            //let { set_loading } = this.props;

            document.title = 'Log In';

            let body = document.getElementsByTagName('body')[0];
            body.classList.add("login_bckg");
            // set_loading(false);
        }
    })
)

export default enhance;
