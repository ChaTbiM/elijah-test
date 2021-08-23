import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react'
import styles from './AddTaxForm.module.css'

export default function AddTaxForm() {
    const formRef = useRef();


    const submitForm = () => {
        if (formRef.current) {
            if (formRef.current.isValid) {
                formRef.current.handleSubmit();
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.header}>
                    <p>Add Tax</p>
                    <p>X</p>
                </div>
                <Formik
                    initialValues={{ name: 'four', rate: 0, appliedTo: "some" }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required name';
                        }

                        if (!values.rate) {
                            errors.rate = "Required rate"
                        }
                        return errors;
                    }}
                    innerRef={formRef}
                    onSubmit={(values) => console.log('after for values',values)}
                >
                    { () => (
                        <Form className={styles.form}>
                            <div className={styles.inputs}>
                                <div className={styles.fields}>
                                    <span className={styles.input__container + ' ' + styles.name__container}><Field type="text" name="name" className={styles.name__input} /></span>
                                    <span className={styles.input__container + ' ' + styles.rate__container}><Field type="number" name="rate" className={styles.rate__input} />%</span>
                                </div>
                                <div className={styles.errors}>
                                    <ErrorMessage name="name" component="span" />
                                    <ErrorMessage name="rate" component="span" />
                                </div>
                            </div>
                            <div role="group" aria-labelledby="my-radio-group" className={styles.radio__group}>
                                <label className={styles.radio__label}>
                                    Apply to all items in collection
                                    <Field type="radio" name="appliedTo" value="all" />
                                    <span className={styles.checkmark}></span>
                                </label>
                                <label className={styles.radio__label}>
                                    Apply to specific items
                                    <Field type="radio" name="appliedTo" value="some" />
                                    <span className={styles.checkmark}></span>
                                </label>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
            <hr />
            <div>
                <p>hi</p>
            </div>
            <button type="submit" onClick={submitForm} >
                Submit
            </button>
        </div>
    )
}
