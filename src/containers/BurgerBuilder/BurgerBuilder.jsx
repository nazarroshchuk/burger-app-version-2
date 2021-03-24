import React, { Component } from "react";

import { Auxx } from '../../hoc/Auxx/Auxx';
import { Burger } from '../../components/Burger/Burger';
import { BuildControls } from '../../components/Burger/BuildControls/BuildControls';
import { Modal  } from "../../components/UI/Modal/Modal";
import { OrderSummary } from '../../components/Burger/OrderSummary/OrderSummary';
import { init as axios } from '../../services/axios-orders';
import { Spinner } from '../../components/UI/Spinner/Spinner';
import { withErrorHandler } from '../../hoc/withErrorHandler/withErrorHandler';




const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    bacon: 0.7,
    meat: 1.3
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        errorInit: false,
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            })
            .catch(error => {
                this.setState({ errorInit: true, loading: false });
            });
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(ingKey => ingredients[ingKey])
            .reduce((sum, el) => sum + el, 0);
        this.setState({ purchasable: sum >   0 })
    }


    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        if (this.state.purchasing) {
            alert('Sending your order...')
        }
        this.setState((state) => ({purchasing: !state.purchasing}))
    }

    purchaseCancel = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinue = () => {
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'test',
                address: {
                    street: 'Teststreet',
                    zipCode: '23423',
                    country: 'Germany,'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest',
        }

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {
        const disabled = { ...this.state.ingredients}
        for ( const key in disabled) {
            disabled[key] = disabled[key] <= 0
        }

        return (
            !this.state.errorInit
            ? (
                <Auxx>
                        {/*{ this.state.purchasing &&*/}
                        {/*// visibility was implemented with help  styling CSS in Modal component//*/}
                        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancel}>
                            {(!this.state.ingredients || this.state.loading)
                                ? <Spinner />
                                : <OrderSummary
                                    ingredients={this.state.ingredients}
                                    cancelBtn={this.purchaseCancel}
                                    continueBtn={this.purchaseContinue}
                                    totalPrice={this.state.totalPrice}
                                />
                            }
                        </Modal>
                        {this.state.ingredients
                            ? (
                                <Auxx>
                                    <Burger ingredients={this.state.ingredients}/>
                                    <BuildControls
                                        ingredientAdded={this.addIngredientHandler}
                                        ingredientRemove={this.removeIngredientHandler}
                                        disabled={disabled}
                                        price={this.state.totalPrice}
                                        purchasable={this.state.purchasable}
                                        ordered={this.purchaseHandler}
                                    />
                                </Auxx>
                            )
                            : <Spinner />
                        }
                    </Auxx>
                )
                : <p>Application can't be load ...</p>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios );