import emptyImage from '../common/EmptyImage.png';

import { Image, Segment } from 'semantic-ui-react';

import calculatePrice from '../common/commonFunctions/calculatePrice';

import './Product.sass';

export default class Product extends React.Component {
    constructor(props) {
        super(props);
    };

    editProduct = data => {
        this.props.editProduct({...this.props})
    };

    render() {

        const discount = (
            <div className="wrapper"></div>
        );

        return (
            <Segment className="Product" onClick={this.editProduct}>
                <div className="left-block">

                    <div className="image">
                        {!!this.props.discount && (
                            <div className="discount">
                                {discount}
                                <p>{`${this.props.discount}%`}</p>
                            </div>
                        )}

                        <Image src={this.props.imagePath || emptyImage} alt={this.props.title || 'No image'}/>
                    </div>

                </div>

                <div className="right-block">
                    <div className="category">Category: {this.props.category}</div>
                    <h3>{this.props.title || 'No title'}</h3>
                    <p>{this.props.description ? (this.props.description.slice(0, 100) + '...') : 'No description'}</p>
                    <p className="price">Цена: {`${calculatePrice(this.props.price, this.props.discount)} руб.`}</p>
                </div>
            </Segment>
        );
    };
};