/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { format, isToday } from 'date-fns';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';

import { formatCurrency } from '../../utils/helpers';
import { formatDistanceFromNow } from '../../utils/helpers';
import Menus from '../../ui/Menus';
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../check-in-out/queries/useCheckout';
import useDeleteBooking from './queries/useDeleteBooking';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;

const statusToTagName = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver',
};

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { mutate: deleteBooking, isDeleting } = useDeleteBooking();

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}{' '}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(endDate), 'MMM dd yyyy')}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus>
          <Menus.Menu>
            <Menus.Toggle id={bookingId} />

            <Menus.List id={bookingId}>
              <Menus.Button
                onClick={() => navigate(`/bookings/${bookingId}`)}
                icon={<HiEye />}
              >
                See details
              </Menus.Button>

              {status === 'unconfirmed' && (
                <Menus.Button
                  onClick={() => navigate(`/checkin/${bookingId}`)}
                  icon={<HiArrowUpOnSquare />}
                >
                  Check in
                </Menus.Button>
              )}

              {status === 'checked-in' && (
                <Menus.Button
                  onClick={() => checkout(bookingId)}
                  disabled={isCheckingOut}
                  icon={<HiArrowDownOnSquare />}
                >
                  Check out
                </Menus.Button>
              )}
              <Modal.Open opensWindowName='delete'>
                <Menus.Button disabled={isDeleting} icon={<HiTrash />}>
                  Delete
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name='delete'>
            <ConfirmDelete
              onConfirm={() => deleteBooking(bookingId)}
              disabled={isDeleting}
              resource='Booking'
            />
          </Modal.Window>
        </Menus>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
