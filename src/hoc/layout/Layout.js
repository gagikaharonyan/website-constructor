import React,{Component} from 'react';

/* Main Layout */
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

/* Languages */
import lang from '../../lang/en/en.json';

const layout = (ChildComponent, type = 'default') =>
    class Layout extends Component {
        render() {
            const {...rest} = this.props
            const combineRest = {...rest, lang}

            return (
                <>
                    {/* for default pages*/}
                    {
                        (type === 'default') ?
                        <>
                            <Header {...combineRest}/>
                            <ChildComponent
                                {...combineRest}
                            />
                            <Footer lang={lang}/>
                        </> : null
                    }
                    {/* for login pages*/}
                    {
                        (type === 'login') ?
                            <ChildComponent
                                {...combineRest}
                            /> : null
                    }
                </>
            );
        }
    };

export default layout;