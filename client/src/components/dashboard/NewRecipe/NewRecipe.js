import React, { useState, useRef } from 'react';
import api from '../../../utils/api';

import { Container, Grid, Typography, TextField, MenuItem, Button, ButtonGroup, IconButton,
         Radio, RadioGroup, FormControlLabel, Stepper, Step, StepLabel, StepContent, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Autocomplete from '@material-ui/lab/Autocomplete';

import logo from '../../../shared/images/recipe_logo.jpg';

// import { SearchContext } from "../App";

const measures = [
    {
      value: 'lb',
      label: 'lb',
    },
    {
      value: 'g',
      label: 'g',
    },
    {
      value: 'kg',
      label: 'kg',
    },
    {
      value: 'ml',
      label: 'ml',
    },
    {
        value: 'L',
        label: 'L',
    },
    {
        value: 'tbs',
        label: 'tbs',
    },
  ];

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        float: 'right',
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        textAlign: 'left'
    },
    image: {
        width: '45%',
        height: 200,
        minWidth: 180,
        minHeight: 150,
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        '&:hover': {
        background: 'rgb(0, 0, 0)',
        transition: '.4s ease',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 0
        }
    },
    changeImage: {
        position: 'absolute',
        color: 'white',
        overflow: 'hidden',
        width: 'min-content',
        '&:hover': {
        transition: '.4s ease'
        }
    },
    imageDiv: {
        height: "100%",
        width: "100%",
        zIndex: 1,
        '&:hover': {
            transition: '.4s ease',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
            opacity: 0.2
        }
    },
    icon: {
        fontSize: 80
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 100,
    },
    addIngredient: {
        display: 'flex',
        alignItems: 'center'
    },
    basics_align: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    deleteChipIcon: {
        label: 'dishType'
    }
}))


function getSteps() {
    return ['Basic info', 'Ingredients', 'Instructions', 'Additional info'];
  }
  
function getStepContent(step, list_of_content) {
    switch (step) {
      case 0:
        return (list_of_content[0]);
      case 1:
        return (list_of_content[1]);
      case 2:
        return (list_of_content[2]);
      case 3:
        return (list_of_content[3]);
      default:
        return '';
    }
  }

export default function NewRecipe() {
    const classes = useStyles();

    // recipe

    let initialState = {
        title: '',
        servings: 1,
        readyInMinutes: '',
        healthy: 'false',
        image: null,
        extendedIngredients: [
            { name: '', amount: '', unit: '' }
        ],
        instructions: [
            ''
        ],
        cuisines: [],
        dishTypes: [],
        diets: [],
        occasions: []
    };

    const [recipe, setRecipe] = useState(initialState);
    
    const handleRecipe = e => {
        let recipe_values = {...recipe}
        let { name, value } = e.target;

        // TODO 
        // change this

        if (['name', 'amount', 'unit'].includes(name)){
            recipe_values.extendedIngredients[e.currentTarget.id][name] = value;
            setRecipe(recipe_values);
        }
        else if (name === 'instructions'){
            recipe_values.instructions[e.target.id] = value;
            setRecipe(recipe_values);
        }
        else if (['addOne','subOne'].includes(e.currentTarget.id)){
            recipe_values.servings += (e.currentTarget.id === 'addOne' ? 1 : -1);
            setRecipe(recipe_values);
        }
        else {
            recipe_values[name] = value
            setRecipe(recipe_values);
        }
    }

    const handleAutocomplete = (type, value) => {
        let recipe_values = {...recipe};
        switch(type){
            case 'cuisines':
                recipe_values['cuisines'] = value;
                setRecipe(recipe_values);
                break;
            case 'dishTypes':
                recipe_values['dishTypes'] = value;
                setRecipe(recipe_values);
                break;
            case 'diets':
                recipe_values['diets'] = value;
                setRecipe(recipe_values);
                break;
            case 'occasions':
                recipe_values['occasions'] = value;
                setRecipe(recipe_values);
                break;
            default:
                setRecipe(recipe_values);
                break;
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        let newRecipe = recipe;

        let prepTimeToNumber = newRecipe.readyInMinutes ? parseInt(newRecipe.readyInMinutes) : 0;
        newRecipe.readyInMinutes = prepTimeToNumber;

        // TODO
        // do this in another way
        
        let ingredients = [];
        for (let i=0; i<newRecipe.extendedIngredients.length; i++){
            ingredients[i] = newRecipe.extendedIngredients[i].name;
        }

        newRecipe['ingredients'] = ingredients;
       

        // handling image

        const recipe_with_image = new FormData() 
        recipe_with_image.append('file', newRecipe.image)

        delete newRecipe.image;
        recipe_with_image.append('recipe', newRecipe)

        console.log(recipe_with_image)
        try {
            api.post('/recipe/create', recipe_with_image, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }})
               .then(res => console.log("recipe added!"));
        } catch(err){
            console.log(err);
        }

        // api.post('api/file', newRecipe.image)
        //     .then(res => console.log("image saved"));
    }

    const AddInputField = list => {
        const values = {...recipe};
        const newList = [...list]

        if (list === recipe.extendedIngredients){
            newList.push({ name: '', amount: '', unit: '' });
            values.extendedIngredients = newList
            setRecipe(values);
        }
        else {
            newList.push('');
            values.instructions = newList
            setRecipe(values);
        }
    }
    
    const RemoveInputField = (i, list) => {
        if (list.length > 1){
            const values = {...recipe}
            const newList = [...list];
            newList.splice(i, 1);
            if (list === recipe.extendedIngredients){
                values.extendedIngredients = newList;
                setRecipe(values);
            }
            else {
                values.instructions = newList;
                setRecipe(values);
            }
        }
      }

    // image

    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);

    const handleImageUpload = e => {
        let recipe_values = {...recipe}
        const [file] = e.target.files;
        if (file) {
        const reader = new FileReader();
        const { current } = uploadedImage;
        current.file = file;
        reader.onload = e => {
            current.src = e.target.result;
        };
        console.log(file);
        recipe_values.image = file;
        setRecipe(recipe_values);
        reader.readAsDataURL(file);
        }
    };

    // stepper

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    const handleReset = () => {
        setRecipe(initialState);
        setActiveStep(0);
      };


    // form validation

    const validateForm = (i) => {
    //     switch(i) {
    //         case 0:
    //             if (recipe.title === '' ||
    //                 recipe.readyInMinutes <= 0 ||
    //                 recipe.readyInMinutes === '')
    //                     return true;
    //             else return false;
    //         case 1:
    //             if (recipe.extendedIngredients[0].name === '' ||
    //                 recipe.extendedIngredients[0].amount <= 0 ||
    //                 recipe.extendedIngredients[0].amount === '' ||
    //                 recipe.extendedIngredients[0].unit === '')
    //                     return true;
    //             else return false;
    //         case 2:
    //             if (recipe.instructions[0] === '')
    //                     return true;
    //             else return false;
    //         case 3:
    //             if (recipe.dishTypes === [])
    //                     return true;
    //             else return false;
    //         default:
    //             return true;
    //     }
    }

    // stepper content

    let Basics = <Grid container spacing={2}>
                        <Grid item xs={7} sm={7} md={7} xl={7}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={2} xl={2} className={classes.basics_align}>
                                    <Typography>Title</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={9} xl={9}>
                                    <TextField
                                        id="recipe_name"
                                        name="title"
                                        size="small"
                                        label="Recipe name"
                                        value={recipe.title}
                                        required
                                        onChange={handleRecipe}
                                        multiline
                                        placeholder="e.g. Pasta with chicken and mushrooms"
                                        variant="outlined"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                               
                                <Grid item xs={12} sm={12} md={2} xl={2} className={classes.basics_align}>
                                    <Typography>Prep time</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={9} xl={9}>
                                    <TextField 
                                        id="minutes"
                                        name="readyInMinutes"
                                        label="Minutes"
                                        required
                                        value={recipe.readyInMinutes}
                                        placeholder="e.g. 45"
                                        onChange={handleRecipe}
                                        size="small"
                                        variant="outlined"
                                        fullWidth={true}
                                        type="number"
                                        InputProps={{ inputProps: { min: 0} }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} xl={2} className={classes.basics_align}>
                                    <Typography>Servings</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={9} xl={9}>
                                    <ButtonGroup size="small" aria-label="small outlined button group">
                                        <Button id="subOne" color="secondary" disabled={recipe.servings === 1 ? true : false} onClick={handleRecipe}>-</Button>
                                        <Button color="secondary">{recipe.servings}</Button>
                                        <Button id="addOne" color="secondary" onClick={handleRecipe}>+</Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} xl={2} className={classes.basics_align}>
                                    <Typography>Healthy</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={9} xl={9}>
                                    <RadioGroup row value={recipe.healthy} onChange={handleRecipe}>
                                        <FormControlLabel name="healthy" value="true" control={<Radio size="small"/>} label="True" />
                                        <FormControlLabel name="healthy" value="false" control={<Radio size="small"  />} label="False" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} xl={5}>
                            <div className={classes.image}>
                                <Typography variant="h5" className={classes.changeImage}>Click to change image</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={imageUploader}
                                    style={{
                                    display: "none",
                                    }}
                                />
                                <div className={classes.imageDiv}
                                    onClick={() => imageUploader.current.click()}>
                                    <img
                                        src={recipe.image}
                                        alt="recipe_logo"
                                        ref={uploadedImage}
                                        style={{width: "100%", height: "100%"}}
                                        />
                                </div>
                            </div>
                            
                        </Grid>
                    </Grid>;
    
    let Ingredients = <Grid container spacing={2} className={classes.details}>
                            <Grid item>
                                <Typography variant="body2">There must be at least one ingredient.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.addIngredient}>
                                <IconButton onClick={() => AddInputField(recipe.extendedIngredients)}>
                                    <AddCircleIcon />
                                </IconButton>
                                <Typography>Click here to add ingredient</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {recipe.extendedIngredients.map((field, id) => {
                                    return (
                                        <Grid container key={`${field}-${id}`} spacing={3}>
                                        <Grid item xs={2} sm={2}>
                                            <TextField
                                                id={id.toString()}
                                                name="amount"
                                                label="Amount"
                                                placeholder="e.g. 100"
                                                required
                                                value={recipe.extendedIngredients[id].amount}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0} }}
                                                onChange={handleRecipe}
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField
                                                id={id.toString()}
                                                select
                                                name="unit"
                                                label="Measure"
                                                defaultValue=''
                                                required
                                                value={recipe.extendedIngredients[id].unit}
                                                onChange={handleRecipe}
                                                size="small"
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                >
                                                {measures.map((option) => (
                                                    <MenuItem id={id} key={option.value} value={option.value}>
                                                    {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={7} sm={7}>
                                        <TextField
                                            id={id.toString()}
                                            size="small"
                                            name="name"
                                            label="Ingredient name"
                                            value={recipe.extendedIngredients[id].name}
                                            placeholder="e.g. pasta"
                                            required
                                            onChange={handleRecipe}
                                            variant="outlined"
                                            fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                        </TextField>
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            <IconButton onClick={() => RemoveInputField(id, recipe.extendedIngredients)}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Grid>
                                </Grid>
                                )})}
                            </Grid>
                        </Grid>;
        
    let Instructions = <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body2">Please write detailed instructions.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.addIngredient}>
                                <IconButton onClick={() => AddInputField(recipe.instructions)}>
                                    <AddCircleIcon />
                                </IconButton>
                                <Typography>Click here to add instruction</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {recipe.instructions.map((field, id) => {
                                    return (
                                        <Grid container key={`instruction-${id}`} spacing={3}>
                                        <Grid item xs={11} sm={11} md={11} xl={11}>
                                            <TextField
                                                id={id.toString()}
                                                name="instructions"
                                                label={"Step " + (id+1).toString()}
                                                value={recipe.instructions[id]}
                                                required
                                                placeholder={id === 0 ? "e.g. Cook pasta in water." : ''}
                                                onChange={handleRecipe}
                                                variant="outlined"
                                                multiline
                                                fullWidth={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                            />
                                        </Grid>
                                        <Grid item xs={1} sm={1} md={1} xl={1}>
                                            <IconButton onClick={() => RemoveInputField(id, recipe.instructions)}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Grid>
                                        </Grid>
                                )})}
                            </Grid>
                        </Grid>;
    
    let Additional = <Grid container direction="column" spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography>Press enter after entering value.</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} xl={6}>
                            <Autocomplete
                                multiple
                                freeSolo
                                size="small"
                                options={[]}
                                onChange={(e, value) => {handleAutocomplete('cuisines', value); }}
                                ChipProps={{color: 'secondary', variant: 'outlined'}}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Cuisines"
                                        placeholder="e.g. Italian"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                    }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} xl={6}>
                            <Autocomplete
                                multiple
                                freeSolo
                                size="small"
                                options={[]}
                                onChange={ (e, value) => {handleAutocomplete('dishTypes', value); }}
                                ChipProps={{color: 'secondary', variant: 'outlined'}}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        placeholder="e.g. Lunch"
                                        variant="outlined"
                                        label="Dish Types"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                    }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} xl={6}>
                            <Autocomplete
                                multiple
                                freeSolo
                                size="small"
                                options={[]}
                                onChange={(e, value) => {handleAutocomplete('diets', value); }}
                                ChipProps={{color: 'secondary', variant: 'outlined'}}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="e.g. Gluten free"
                                        label="Diets"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                    }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} xl={6}>
                            <Autocomplete
                                multiple
                                freeSolo
                                size="small"
                                onChange={(e, value) => {handleAutocomplete('occasions', value); }}
                                options={[]}
                                placeholder="e.g. Summer"
                                ChipProps={{color: 'secondary', variant: 'outlined'}}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Occasions"
                                        placeholder="e.g. Summer"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                    }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>;
                
    return (
        <Container className={classes.container}>
                <Typography variant="h4">Create new recipe</Typography>
                <Typography variant="body2">
                    If you don't fill out all the required fields, you will not be able to create your recipe. 
                    Required fields are marked with *.</Typography>
                    <hr />
                    <Grid container direction="column" spacing={3}>
                        <form onSubmit={handleSubmit} className={classes.form}>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Typography component='span'>{getStepContent(index,[Basics, Ingredients, Instructions, Additional])}</Typography>
                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button
                                                    color="secondary"
                                                    variant="contained"
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                                disabled={validateForm(index)}
                                                >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </div>
                                        </div>
                                    </StepContent>
                                    </Step>
                                ))}
                                </Stepper>
                                {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <div>
                                        <Typography>All steps are completed. Now you can create your recipe.</Typography>
                                        <Button color="secondary" variant="contained" disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                            Back
                                        </Button>
                                        <Button className={classes.button} variant="contained" color="primary" type="submit">Create</Button>
                                        <Button className={classes.button} variant="contained" color="secondary" onClick={handleReset}>Cancel</Button>
                                    </div>
                                </Paper>
                                )}
                        </form>
                    </Grid>
        </Container>

    );
  }