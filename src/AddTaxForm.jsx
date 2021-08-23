import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import styles from './AddTaxForm.module.css'
// import data from './data';

export default function AddTaxForm({ appliedToData, list }) {
    const formRef = useRef();
    const [organizedItems, setOrganizedItems] = useState(null)
    const [categories, setCategories] = useState([])
    const [applicableItems, setApplicableItems] = useState([])


    const submitForm = () => {
        if (formRef.current) {
            if (formRef.current.isValid) {
                formRef.current.handleSubmit();
            }
        }
    }

    useEffect(() => {
        if (appliedToData) {
            setApplicableItems(appliedToData["applicable_items"])
        }
    })


    useEffect(() => {
        if (list) {
            const items = {}
            const categories = []
            list.forEach((item) => {
                if (item?.category?.id && item.category.name) {
                    if (items.hasOwnProperty(item.category.name)) {
                        items[item.category.name].push(item)
                    } else {
                        items[item.category.name] = [item]
                        categories.unshift(item.category.name)
                    }
                } else {
                    if (items.hasOwnProperty("Other")) {
                        items["Other"].push(item)
                    } else {
                        items["Other"] = [item]
                        categories.push("Other")
                    }
                }
            })
            setCategories(categories)
            setOrganizedItems(items)
        }
    }, [list])


    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.header}>
                    <p>Add Tax</p>
                    <p>X</p>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={appliedToData ? { ...appliedToData, applicableItems , checkedCategories:[] } : { name: '', rate: 0, ['applied_to']: "some" }}
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
                    onSubmit={(values) => console.log('after for values', values)}
                >
                    {() => (
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
                                    <Field type="radio" name="applied_to" value="all" />
                                    <span className={styles.mark + ' ' + styles.radio__mark}></span>
                                </label>
                                <label className={styles.radio__label}>
                                    Apply to specific items
                                    <Field type="radio" name="applied_to" value="some" />
                                    <span className={styles.mark + ' ' + styles.radio__mark }></span>
                                </label>
                            </div>
                            <hr className={styles.line} />
                            <div className={styles.options}>
                                {
                                    organizedItems !== null &&
                                    categories.map((category, index) => {
                                        return (
                                            <div>
                                                <p>{category}</p>
                                                {organizedItems[category].map((item, i) => {
                                                    return (
                                                        <label className={styles.radio__label}>
                                                            {item.name}
                                                            <Field type="checkbox" name="applicableItems" value={item.id} />
                                                            <span className={styles.mark + ' ' + styles.check__mark}></span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
            <hr />
            <button type="submit" onClick={submitForm} >
                Submit
            </button>
        </div>
    )
}
