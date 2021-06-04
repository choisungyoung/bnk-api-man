// Start Column Checkbox
export function CustomSingleCheckboxRowHeaders(props){
    const { grid, rowKey } = props;

    const label = document.createElement('label');
    label.className = 'checkbox';
    label.setAttribute('for', String(rowKey));

    const hiddenInput = document.createElement('input');
    hiddenInput.style.verticalAlign = 'bottom';
    hiddenInput.className = 'hidden-input';
    hiddenInput.id = String(rowKey);

    const customInput = document.createElement('span');
    customInput.className = 'custom-input';

    label.appendChild(hiddenInput);
    label.appendChild(customInput);

    hiddenInput.type = 'checkbox';
    hiddenInput.addEventListener('change', () => {
        if(hiddenInput.checked){
            let rowKeys = grid.getCheckedRowKeys();
            for(let key of rowKeys){
                if(key != rowKey){
                    grid.uncheck(key);        
                }
            }
            grid.check(rowKey);
        }
        else{
            grid.uncheck(rowKey);
        }
    });

    this.el = label;
    this.render(props);
}

CustomSingleCheckboxRowHeaders.prototype.getElement = function() {
    return this.el;
}

CustomSingleCheckboxRowHeaders.prototype.render = function(props){
    const hiddenInput = this.el.querySelector('.hidden-input');
    const checked = Boolean(props.value);

    hiddenInput.checked = checked;
}
// End Column Checkbox

// Start Column Checkbox
export function CustomCheckbox(props){
    const el = document.createElement('input');
    const { grid, rowKey, columnInfo } = props;

    el.type = 'checkbox';
    el.addEventListener('change', function() {
        grid.setValue(rowKey, columnInfo.name, el.checked);
    });
    this.el = el;
    this.render(props);
}

CustomCheckbox.prototype.getElement = function() {
    return this.el;
}

CustomCheckbox.prototype.getValue = function() {
    return this.el.checked;
}

CustomCheckbox.prototype.render = function(props){
    let input = props.grid.getElement(props.rowKey, props.columnInfo.name).querySelector('input'),
        value = props.value;
    if(input){
        value = input.checked;
    }   
    this.el.checked = Boolean(value);
}
// End Column Checkbox

// Start Column SingleCheckbox
export function CustomSingleCheckbox(props){
    const el = document.createElement('input');
    const { grid, rowKey, columnInfo } = props;

    el.type = 'checkbox';
    el.addEventListener('change', function() {
        if(el.checked){
            let rowCnt = grid.getRowCount();
            for(let i = 0; i < rowCnt; i++){
                if(i === rowKey){
                    continue;
                }
                if(grid.getRow(i)[columnInfo.name]){
                    grid.setValue(i, columnInfo.name, false);
                    let rowEl = grid.getElement(i, columnInfo.name);
                    if(rowEl){
                        rowEl.querySelector('input').checked = false;
                    }  
                }
            } 
        }
        grid.setValue(rowKey, columnInfo.name, el.checked);
    });

    this.el = el;
    this.render(props);
}

CustomSingleCheckbox.prototype.getElement = function() {
    return this.el;
}

CustomSingleCheckbox.prototype.getValue = function() {
    return this.el.checked;
}

CustomSingleCheckbox.prototype.render = function(props){
    let input = props.grid.getElement(props.rowKey, props.columnInfo.name).querySelector('input'),
        value = props.value;
    if(input){
        value = input.checked;
    }   
    this.el.checked = Boolean(value);
}
// End Column SingleCheckbox


// Start Column Button
export function CustomButton(props){
    const el = document.createElement('button');
    const { columnInfo } = props;
    let buttonInfo = columnInfo.renderer.buttonInfo;

    el.type = 'button';
    el.className = buttonInfo.class;
    el.innerText = buttonInfo.innerText;
    el.addEventListener('click', function(){
        buttonInfo.click(props);
    });

    this.el = el;
    this.render(props);
}

CustomButton.prototype.getElement = function() {
    return this.el;
}

CustomButton.prototype.render = function(){
    this.el;
}
// End Column Button

export function convertTreeData(dataList, expandedValue, idName, parentIdName) {
    const result = [];
    for (let index in dataList) {
        let data =  dataList[index],
            depth = Object.prototype.hasOwnProperty.call(data,'depth') ? data.depth : data.level;

        if (0 == depth) {
            data._attributes = { expanded: true };
            result.push(data)
        }
        else {
            let parentUid = data[parentIdName];
            appendChild(result, idName, parentUid, data, expandedValue);
        }
    }
    return result;
}

function appendChild(result, idName, parentUid, child, expandedValue) {
    for (let index in result) {
        let data = result[index], 
            id = data[idName];

        if (parentUid == id) {
            if (!Object.prototype.hasOwnProperty.call(data,'_children')) {
                data._children = [];
            }
            if(!Object.prototype.hasOwnProperty.call(data, '_attributes')){
                data._attributes = {
                    expanded: typeof expandedValue === 'boolean' ?  expandedValue : true
                }                 
            }
            data._children.push(child);
            break;
        }
        else {
            if (data._children != null) {
                appendChild(data._children, idName, parentUid, child, expandedValue);
            }
        }
    }
}