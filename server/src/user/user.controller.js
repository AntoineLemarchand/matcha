import User from './user.model.js';

async function getAll(req, res) {
    const user = new User();
    try {
        const result = await user.getAll();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getById(req, res) {
    const user = new User();
    try {
        const result = await user.getFromId(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function update(req, res) {
    const user = new User();
    try {
        const result = await user.update(req.params.id, req.body);
        res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message, trace: error.stack });
    }
}

export default { getAll, getById, update };
