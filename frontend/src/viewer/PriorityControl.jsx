import React, {Component} from 'react';
import { Range } from 'rc-slider';


class PriorityControl extends Component {

    render() {
        return(
            <div className="priority-control-bar">
                <Range defaultValue={[0,4]}
                        allowCross={false}
                        min={1}
                        max={4}
                        dots={true}
                        onAfterChange={this.props.updateRange}
                        marks={{
                            1 : "1",
                            2 : "2",
                            3 : "3", 
                            4 : "4"
                        
                        }}/>
            </div>
        )
    }
}

export default PriorityControl