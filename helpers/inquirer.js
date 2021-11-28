const inquirer = require('inquirer');
// const { validate } = require('uuid');
require('colors')

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What you want to do?'.bold,
        choices: [
            {
                value: 1,
                name: `${'1.'.yellow} Search a city`
            },
            {
                value: 2,
                name: `${'2.'.yellow} History`
            },
            {
                value: 0,
                name: `${'0.'.yellow} ${'Exit'.red}`
            }

        ]
    }
]

const inquirerMenu = async () => {
    // console.clear();
    console.log('\n==================='.rainbow);
    console.log('Select an option'.white.bold);
    console.log('===================\n'.rainbow);

    const {option} = await inquirer.prompt(questions);
    return option

}

const pause = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.cyan} to continue\n`
        }
    ]

    console.log('\n');

    await inquirer.prompt(question)
}


const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    throw 'Please enter a value';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question)
    return desc
}


const listPlaces = async(places = []) => {
    const choices = places.map((p, i)=> {

        const idx = `${i + 1}.`.yellow

        return {
            value: p.id,
            name: `${idx} ${p.name}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0. '.yellow + 'Cancel'
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select a place:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(questions);
    return id
}

const confirm = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const { ok } = await inquirer.prompt(question)
    return ok
}



const showListChecklist = async(tasks = []) => {
    const choices = tasks.map((t, i)=> {

        const idx = `${i + 1}.`.yellow

        return {
            value: t.id,
            name: `${idx} ${t.desc}`,
            checked: (t.completedIn) ? true : false
        }
    })


    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Select',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(question);
    return ids
}


module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showListChecklist
}