import Router from 'koa-router';
import { auth, authz } from '../../../middlewares/index.js';
import { User } from '../../../models/index.js';

const router = new Router({
  prefix: '/(v1|latest)/users',
});

// Get all users
router.get('/', auth, authz('user:list'), async (ctx) => {
  try {
    const result = await User.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one user
router.get('/:id', async (ctx) => {
  const result = await User.findById(ctx.params.id);
  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
  ctx.throw(404);
});

// Query users
router.post('/query', auth, authz('user:query'), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await User.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create a user
router.post('/', auth, authz('user:create'), async (ctx) => {
  try {
    const user = new User(ctx.request.body);
    await user.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update a user
router.patch('/:id', auth, authz('user:update'), async (ctx) => {
  try {
    await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete a user
router.delete('/:id', auth, authz('user:create'), async (ctx) => {
  try {
    await User.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

export default router;
