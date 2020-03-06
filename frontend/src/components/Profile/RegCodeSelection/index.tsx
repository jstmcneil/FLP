import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ADD_REG_CODE } from '../../../actions/types';
import { regCodesSelector, isInstructorSelector } from '../../../selectors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

interface RegCodeSelectionProps {
    addRegCodeAction: Function;
    regCodes: string[];
}

interface RegCodeSelectionState {
    newRegCode: string;
}

class RegCodeSelection extends React.Component<RegCodeSelectionProps, RegCodeSelectionState> {
    constructor(props: RegCodeSelectionProps) {
        super(props);
        this.state = {
            newRegCode: ""
        };
    }
    
    render() {
        if (!this.props.regCodes) {
            return <Fragment />;
        }
        return (
            <div>
                <div className="verticalContainer">  
                        <div>Registration Codes</div>
                        <div style={{margin: "auto"}}>
                            <Table style={{ textAlign: "center", maxWidth: 100 }}>
                                <TableBody>
                                    {this.props.regCodes.map(regCode => (
                                        <TableRow>
                                            <TableCell component="div" scope="row">
                                                {regCode}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div style={{padding: "10px", margin: "auto"}}>
                            <input type="text" onInput={(event) => this.setState({ newRegCode: event.currentTarget.value })}></input>
                            <button style={{width: "auto"}} onClick={() => this.props.addRegCodeAction(this.state.newRegCode)}>Add Registration Code</button>
                        </div>
                </div>  
            </div>
        )
    }
};

export default connect(state => {
    return {
        regCodes: regCodesSelector(state),
        isInstructor: isInstructorSelector(state)
    }
}, 
    dispatch => { 
        return {
            addRegCodeAction: (regCode: string) => dispatch({type: ADD_REG_CODE, payload: { regCode }}) 
        }
    })(RegCodeSelection);
