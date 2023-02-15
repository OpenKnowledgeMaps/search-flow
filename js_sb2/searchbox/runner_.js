// import SearchBox from "./components/SearchBox.js";

const container = document.getElementById('search_box_test');
    const root = ReactDOM.createRoot(container);
root.render(
    // <SearchBox/>
    <div className={'flex items-center justify-center mt-10'}>
    <fieldset className="checkbox-mixed">
        <legend>
            Sandwich Condiments
        </legend>
        <div role="checkbox"
             className="group_checkbox"
             aria-checked="mixed"
             aria-controls="cond1 cond2 cond3 cond4"
             tabIndex="0">
            All condiments
        </div>
        <ul className="checkboxes">
            <li>
                <label>
                    <input type="checkbox" id="cond1"/>
                        Lettuce
                </label>
            </li>
            <li>
                <label>
                    <input type="checkbox"
                           id="cond2"
                           defaultChecked="true"/>
                        Tomato
                </label>
            </li>
            <li>
                <label>
                    <input type="checkbox" id="cond3"/>
                        Mustard
                </label>
            </li>
            <li>
                <label>
                    <input type="checkbox" id="cond4"/>
                        Sprouts
                </label>
            </li>
        </ul>
    </fieldset>
    </div>
);
