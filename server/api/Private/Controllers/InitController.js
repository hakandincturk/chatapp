class InitController{

	static async health(req, res){
		return res.json({type: true, message: 'init controller working'});
	}

}

export default InitController;