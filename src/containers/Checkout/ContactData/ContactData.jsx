import React, { Component } from 'react';

import { init as axios } from '../../../services/axios-orders';
import classes from './ContactData.module.css';
import { Button } from '../../../components/UI/Button/Button';
import { Spinner } from '../../../components/UI/Spinner/Spinner';
import { withErrorHandler } from '../../../hoc/withErrorHandler/withErrorHandler';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: '',
        },
        loading: false,
    }


    orderHandler = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
                this.props.history.push('/');
            })
            .finally(() => {
                this.setState({ loading: false });
            })

    }

    render() {
        return (
            !this.state.loading
                ? ( <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                <form>
                    <input className={classes.Input} type='text' name="name" placeholder='Your name'/>
                    <input className={classes.Input} type='email' name="email" placeholder='Your email'/>
                    <input className={classes.Input} type='text' name="street" placeholder='Street'/>
                    <input className={classes.Input} type='text' name="postalCode" placeholder='Postal code'/>
                    <Button
                        btnType='Success'
                        clicked={this.orderHandler}
                    >
                        ORDER
                    </Button>
                </form>
            </div>)
                : <Spinner/>
        )
    }
}

export default withErrorHandler(ContactData, axios)